import { prisma, getStaffRoles } from '$lib/db.js';
import type { File } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function DELETE({ request, locals }): Promise<Response> {
  if (!locals.session) {
    return json({ success: false, error: 'Unauthorized' });
  }

  if (!await getStaffRoles(locals.session.userId, 'files')) {
    return json({ success: false, error: 'Forbidden' });
  }

  let { id } = await request.json();

  let file = await prisma.file.delete({
    where: {
      id: id
    }
  })

  if (!file) {
    return json({ success: false, error: 'File not found' });
  } 

  return json({ success: true });
}

export async function PUT({ request, locals }): Promise<Response> {
  if (!locals.session) {
    return json({ success: false, error: 'Unauthorized' });
  }

  if (!await getStaffRoles(locals.session.userId, 'files')) {
    return json({ success: false, error: 'Forbidden' });
  }

  let document: File;
  document = (await request.json()).data;

  let file = await prisma.file.update({
    where: {
      id: document.id
    },
    data: document
  })

  if (!file) {
    return json({ success: false, error: 'File not found' });
  }

  return json({ success: true });
}