import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export { prisma };


/**
 * 
 * @param ratingInt - Integer Form of Rating
 * @returns {string} Human Readable Rating
 */
export function getRating(ratingInt: number): string {
  switch(ratingInt) {
    case 1:
      return "OBS"
    case 2:
      return "S1"
    case 3:
      return "S2"
    case 4:
      return "S3"
    case 5:
      return "C1"
    case 7:
      return "C3"
    case 8:
      return "I1"
    case 10:
      return "I3"
    case 11:
      return "SUP"
    case 12:
      return "ADM"
  }
}

/**
 * 
 * @param cid - CID of user
 * @returns {boolean} True/false if user is rostered or not
 */
export function isRostered(cid: number): boolean {
  const query = prisma.roster.findFirst({
    where: {
      cid: cid
    }
  })

  
  return query != null
}

/**
 * 
 * @param input - Seconds
 * @returns {string} Hours in HH:MM Format
 */
export function getHours(input: number):string {
  if (input == 0) {
    return "00:00";
  }

  const hours = Math.floor(input / 3600).toString().padStart(2, "0");
  const minutes = Math.floor(input % 3600 / 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`
}

/**
 * 
 * @param input - Duration in Milliseconds
 * @returns {string} Duration in HH:MM Format
 */
export function msToHours(input: number): string {
  return getHours(input/(3.6e+6));
}

/**
 * 
 * @param cid - User CID
 * @param type - Type of page
 * @returns {boolean} True if user has permission to access page
 */

//TODO: Convert the type from string to an enum
export async function getStaffRoles(cid: number, type: string): Promise<boolean> {
  if (cid == null) {
    return false;
  }
  let data = await prisma.staffRole.findMany({
    where: {
      cid: cid
    },
  })
  if (data == null) {
	  return false
  }

  let roles = data.map((role) => role.role);
  let roleString = roles.join(",");
  //TODO: Switch from individual roles to teams; EX: ATM + DATM + TA are "SS", FE + AFEs are "FE", etc.
  switch(type) {
    case "ots": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT") || roleString.includes("INS") || roleString.includes("TA")) {
        return true;
      } else {
        return false;
      }
    }
    case "training": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT") || roleString.includes("INS") || roleString.includes("MTR") || roleString.includes("TA")) {
        return true;
      } else {
        return false;
      }
    }
    case "events": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT") || roleString.includes("EC") || roleString.includes("AEC")) {
        return true;
      } else {
        return false;
      }
    }
    case "roster": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT") || roleString.includes("TA") || roleString.includes("MTR") || roleString.includes("INS")) {
        return true;
      }
      break;
    }
    case "admin": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT")) {
        return true;
      }
    }
    case "files": {
      if (roleString.includes("ATM") || roleString.includes("DATM") || roleString.includes("WT") || roleString.includes("FE") || roleString.includes("AFE")) {
        return true;
      }
    }
    default: {
      return false;
    }
  }
}

export function convertDurationStringToSeconds(timeString: string): number {
  const a = timeString.split(':');
  const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60; 

  return seconds
}

/**
 * 
 * @param input - Date String
 * @returns {string} Date in UTC Format
 */

export function formatDate(input): string {
  let dateTime = new Date(input);
  let year = dateTime.getFullYear();
  let month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  let day = dateTime.getDate().toString().padStart(2, "0");
  let hours = dateTime.getHours().toString().padStart(2, "0");
  let minutes = dateTime.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * @typedef {Object} Certs
 * @property {string} cert - Certification
 * @property {string} color - Color for the page
 */
/**
 * 
 * @param input - Certification in Integer Form
 * @returns {Certs} Certification and Color
 */
export function getCertsColor(input: number): {cert: string, color: string} {
  switch(input) {
    case 0: {
      return {
        cert: "Not Certified",
        color: "slate-500"
      }
    }
    case 1: {
      return {
        cert: "Tier 1",
        color: "green-600"
      }
    }
    case 1.5: {
      return {
        cert: "Tier 1 Solo",
        color: "amber-700"
      }
    }
    case 2: {
      return {
        cert: "Tier 2",
        color: "sky-700"
      }
    }
    case 2.5: {
      return {
        cert: "Tier 2 Solo",
        color: "amber-700"
      }
    }
    case 3: {
      return {
        cert: "Unrestricted",
        color: "indigo-700"
      }
    }
  }
}

/**
 * 
 * @param input - Certification in Integer Form
 * @returns {Certs} Certification and Color
 */
export function getCtrCertColor(input: number): {cert: string, color: string} {
  switch(input) {
    case 1: {
      return {
        cert: "Certified",
        color: "green-600"
      }
    }
    case 0: {
      return {
        cert: "Not Certified",
        color: "slate-500"
      }
    }
    case 1.5: {
      return {
        cert: "Solo Certified",
        color: "yellow-500"
      }
    }
  }
}

export const updateVisitRequest = async(requestId, actionCid, actionMessage, wasAccepted: boolean): Promise<Response> => {
  try {
    if (getStaffRoles(actionCid, "admin")) {
      await prisma.visitRequest.update({
        where: {
          id: requestId
        },
        data: {
          reviewed: true,
          actionCid: actionCid,
          actionMessage: actionMessage,
          actionDate: new Date(),
          accepted: wasAccepted
        }
      })
    }

    return new Response("Update Success", {
      status: 200
    })
  } catch(error) {
    console.error(error)
    return new Response(error, {
      status: 500
    })
  }
}