import { getStaffRoles, isRostered } from '$lib/db.js'
import { fail, redirect } from '@sveltejs/kit'
import { prisma, convertDurationStringToSeconds } from '$lib/db.js'
import { deleteSoloCert, formatTrainingSessionTimeString, submitTrainingNote } from '$lib/vatusaApi.js'

export const actions = {
  submitTicket: async({request, locals}) => {
    try {
      const data = await request.formData()
      const formEntries = Object.fromEntries(data.entries()) // turns into table
      const instructorCid = locals.user.id
      const durationString: string = `${formEntries.hours.toString().padStart(2, "0")}:${formEntries.minutes.toString().padStart(2, "0")}`
      const studentCid = parseInt(formEntries.student_cid as string)

      if(getStaffRoles(instructorCid, "training") && isRostered(studentCid)) {
        const vatusaData = {
          instructor_id: locals.user.id,
          session_date: formatTrainingSessionTimeString(new Date(data.get("session_date") as string)),
          position: formEntries.position as string,
          duration: durationString, // in seconds
          movements: formEntries.movements ? parseInt(formEntries.movements as string) : 0,
          score: parseInt(formEntries.score as string), // Session Score, 1-5
          notes: formEntries.notes as string,
          location: parseInt(formEntries.location as string), // Session Location (0 = Classroom, 1 = Live, 2 = Sweatbox)
          ots_status: 0, // 0 = Not OTS, 1 = OTS Pass, 2 = OTS Fail, 3 = OTS Recommended
          is_cbt: false,
          solo_granted: false
        }

        const response = await submitTrainingNote(parseInt(data.get("student_cid") as string), vatusaData)
        if (response.status == 200) {
          // Push to DB
          const insertion = await prisma.trainingSession.create({
            data: {
              student_cid: studentCid,
              instructorCid: instructorCid,
              session_date: new Date(vatusaData.session_date),
              duration: convertDurationStringToSeconds(vatusaData.duration),
              position: vatusaData.position,
              movements: vatusaData.movements,
              score: vatusaData.score,
              notes: vatusaData.notes,
              location: vatusaData.location,
            }
          })

          return {success: true}
        } else {   
          return fail(response.status, {message: "VATUSA upload failed"})
        }
      } else {
        return fail(403, {message: "Instructor not authenticator or student not rostered"})
      }
    } catch(error) {
      console.log(error)
      return fail(500, {message: error})
    }
  },

  editAssignment: async({request, locals}) => {
    const formData = await request.formData()
    const submitType = formData.get("submitType")
    const instructorCid = parseInt(formData.get("instructorCid") as string)
    const trainingRequestId = parseInt(formData.get("trainingRequestId") as string)

    if(!getStaffRoles(locals.user.id, "training")) {
      return fail(403)
    }

    // basic update
    if (submitType == "submit") {
      // if instructor == null
      if (isNaN(instructorCid)) {
        const dbQuery = await prisma.trainingRequest.update({
          where: {
            trainingRequestId: trainingRequestId
          },
          data: {
            instructorCid: null,
            status: "Awaiting Trainer Assignment",
            dateAssigned: new Date()
          }
        })
        
      // if instructor exists, verify person is ins
      } else {
        if (getStaffRoles(instructorCid, "training")) {
          const dbQuery = await prisma.trainingRequest.update({
            where: {
              trainingRequestId: trainingRequestId
            },
            data: {
              instructorCid: instructorCid,
              status: "In Progress",
              dateAssigned: new Date()
            }
          })
        } else {
          return fail(403)
        }
      }
      return {success: true}
    }
    
    // Deactivate
    if (submitType == "deactivate") {
      const dbQuery = await prisma.trainingRequest.update({
        where: {
          trainingRequestId: trainingRequestId
        },
        data: {
          active: false,
          status: "Forfeit",
          dateAssigned: new Date()
        }
      })

      return {success: true}
    }

    if (submitType == "revokeSolo") {
      const dbQuery = await prisma.trainingRequest.update({
        where: {
          trainingRequestId: trainingRequestId
        },
        data: {
          status: "In Progress",
          dateAssigned: new Date()
        }
      })

      // get student CID
      const query = await prisma.trainingRequest.findFirst({
        select: {
          studentCid: true
        },
        where: {
          trainingRequestId: trainingRequestId
        }
      })
      
      // think of some mystical way to delete solo certs from vatusa

      return {success: true}
    }

    fail(403, {message: "Not implemented"})
  }
}