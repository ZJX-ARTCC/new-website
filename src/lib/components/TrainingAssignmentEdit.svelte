<script lang="ts">
	import { deserialize } from "$app/forms";
  import Icon from "@iconify/svelte";
  interface Props {
    hidePopup: any;
    instructors: any;
    data: any;
    form: any;
  }

  let {
    hidePopup,
    instructors,
    data,
    form
  }: Props = $props();
  let allowSubmit = true

  const formatDateString = (date: Date) => {
    if (date != null) {
      return `${date.getUTCFullYear().toString().padStart(4, "0")}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDay().toString().padStart(2, "0")}`
    } else {
      return "None"
    }
  }

  const handleSubmit = async(e) => {
    if (allowSubmit) {
      allowSubmit = false
      const formData: FormData = new FormData(e.target)
      formData.append("submitType", e.submitter.getAttribute("name"))
      formData.append("trainingRequestId", data.trainingRequestId)
    const response = await fetch(
      "/admin/training-admin/handler?/editAssignment" ,
        {
          method: 'POST',
          body: formData
      }
    )

    const result = deserialize(await response.text())

    if(result.type == "success") {
      hidePopup(true, true, "Assignment Updated")
    } else if (result.type == "error") {
      hidePopup(true, false, result.status + " " + result.error)
      
    }
  }
    allowSubmit = true
  }


</script>

<div class="relative z-50 flex flex-col items-center place-items-center bg-gray-200 px-4 py-2 border-2 border-gray-400">
  <button onclick={() => hidePopup(false, false, "")}>
    <Icon icon="mdi:close" class="w-5 h-5 absolute top-2 right-2"/>
  </button>

  <h2 class="font-bold text-xl text-sky-500">Edit Training Assignment</h2>

  <div>
    <form class="flex flex-col p-2 space-y-4 w-72" onsubmit={handleSubmit}>
      <div class="flex flex-col">
        <label class="font-bold" for="instructor_cid">Instructor (CID)</label>
        <select name="instructorCid" class="px-2 invalid:border-2 invalid:border-red-500" value={data.instructorCid}>
          {#each instructors as instructor}
            {#if !(data.instructorCid == instructor.cid)}
              <option value={instructor.cid}>{instructor.firstName + " " + instructor.lastName} ({instructor.cid})</option>
            {/if}
          {/each}
          <option selected value={data.instructorCid}>{data.instructorName} {data.instructorCid != null ? `(${data.instructorCid})` : ""}</option>

          {#if data.instructorCid}
            <option value={null}>None</option>
          {/if}
        </select>
      </div>

      <div class="flex flex-col">
        <label class="font-bold" for="student_cid">Student (CID)</label>
        <input class="px-2" readonly value={`${data.studentName} (${data.studentCid})`}>
      </div>

      <div class="flex flex-col">
        <label class="font-bold" for="progress">Date Requested</label>
        <input class="px-2" type="text" readonly value={formatDateString(data.dateRequested)}/>
      </div>

      <div class="flex flex-col">
        <label class="font-bold" for="date">Date Updated</label>
        
        <input class="px-2" type="text" readonly value={formatDateString(data.dateAssigned)}>
      </div>

      <button type="submit" name="submit" class="p-2 bg-sky-500 text-white font-bold">Submit Changes</button>
      <button type="submit" name="deactivate" class="p-2 bg-red-500 text-white font-bold">Deactivate Training Request</button>
    </form>
  </div>
</div>