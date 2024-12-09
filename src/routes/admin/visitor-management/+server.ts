import { getStaffRoles, prisma, updateVisitRequest } from '$lib/db.ts'
import { addVisitorToVatusa } from '$lib/vatusaApi.js';
/** @type {import('./$types').RequestHandler} */

export const POST = async ({ request, cookies, locals }): Promise<Response> => {
	try {
		const { requestId, actionMessage } = await request.json();
		
		const vatusaResponse = await addVisitorToVatusa(requestId, locals.user.id)
		let statusText: string

		// NOTE: updateVisitRequest arg #2 uses the cid of the submitting user, NOT the CID of the visit request.
		switch(vatusaResponse.status) {
			case 200:
				const req = await updateVisitRequest(requestId, locals.user.id, actionMessage, true)
				statusText = `Visitor approved!`
				break
			case 401:
			case 403:
				statusText = `Unauthorized - VATUSA`
				break
			case 404:
				statusText = "User not found on VATUSA roster."
				await updateVisitRequest(requestId, locals.user.id, statusText, false)
				break
			case 405:
				statusText = "User not authorized. Must be ATM, DATM, or WM."
			case 422:
				statusText = "User already on visiting roster."
				await updateVisitRequest(requestId, locals.user.id, statusText, false)
				break
			default:
				statusText = "Unknown error occured"
				break
		}

		return new Response(statusText, {status: vatusaResponse.status})
 	} catch(error) {
		console.error(error)
		return new Response(
			error,
			{
				status: 500
			}
		)
	}
};

export const DELETE = async ({ request, cookies, locals }): Promise<Response> => {
	try {
		// Verify user is approved
		const { requestId, actionMessage} = await request.json();

		if((await updateVisitRequest(requestId, locals.user.id, actionMessage, false)).status == 200) {
			notifyUser(requestId, actionMessage)
			return new Response("Rejected!", {status: 200})
		}
	} catch (error) {
		console.error(error)
		return new Response(
			error,
			{
				status: error.status
			}
		)
	}

	return new Response(
		null,
		{status: 501}
	)
};

const notifyUser = (cid, actionMessage) => {
	// TODO
};
