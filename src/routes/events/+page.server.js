//@ts-nocheck
import { prisma } from '$lib/db';
/** @type {import('./$types').PageLoad} */
// eslint-disable-next-line no-unused-vars
export async function load({ params, cookies }) {
  let pageData = {
    loggedIn: false,
    staffInteger: 0,
    events: []
  };
  if (cookies.get("cid")) {
    pageData.loggedIn = true;
  }
  const data = await prisma.events.findMany({
    orderBy: {
      event_start: 'asc'
    }
  });
  pageData.events = data;
  return pageData;
}