import { prisma, getStaffRoles } from '$lib/db';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {

	if (!locals.session) {
		redirect(302, '/login');
	}

	if (!await getStaffRoles(locals.session.userId, 'admin')) {
		redirect(302, '404');
	}
	
	const userData = await prisma.roster.findMany({
		select: {
			cid: true,
			firstName: true,
			lastName: true,
			rating: true,
			homeFacility: true,
			createdAt: true,
			controllerSessions: {
				select: {
					start: true,
					end: true
				}
			}
		},
		orderBy: {
			firstName: 'asc'
		}
	});

	return {
		userData
	};
};
