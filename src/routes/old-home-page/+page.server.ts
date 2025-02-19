import { getHours, getRating, prisma } from '$lib/db';

import type { Stats } from '@prisma/client';
import type { PageServerLoad } from './$types';

const months = ['month_three', 'month_two', 'month_two'];

export const load: PageServerLoad = async ({ cookies, locals }) => {
  //Setup page data
  let pageData = new PageData();

  //Fetch top 3 controllers for the month
  let targetMonth = months[(new Date().getUTCMonth() + 1) % 3]; //Current month + 1 is a numerical representation of the month, Modulo 3 returns where it is within the quarter
  const statsData = await prisma.$queryRaw<Stats[]>`SELECT * FROM stats ORDER BY ${targetMonth} DESC LIMIT 3;`;
  
  //Get the top 3 controllers' names
  for (let i = 0; i < statsData.length; i++) {
    const user = await prisma.roster.findFirst({
      where: {
        cid: statsData[i].cid,
      },
      select: {
        firstName: true,
        lastName: true
      }
    });

    //Setup member object and push it
    let memberStats: MtdStats = {
      hours: getHours(statsData[i][targetMonth]),
      firstName: user.firstName,
      lastName: user.lastName
    }
    pageData.stats.push(memberStats);
  }

  //Fetch last 3 controllers to join the roster
  const rosterData = await prisma.roster.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      firstName: true,
      lastName: true,
      rating: true,
      createdAt: true
    }
  });

  // Sanitize and push data
  for (let i = 0; i < rosterData.length; i++) {
    let member: NewController = {
      firstName: rosterData[i].firstName,
      lastName: rosterData[i].lastName,
      rating: getRating(rosterData[i].rating),
      joined: rosterData[i].createdAt
    }

    pageData.newControllers.push(member);
  }
  //Fetch next 2 events
  const eventsData = await prisma.event.findMany({
    take: 2,
    orderBy: {
      start: 'asc',
    }
  });

  // Sanitize and push data
  for (let i = 0; i < eventsData.length; i++) {
    let event: Event = {
      name: eventsData[i].name,
      start: eventsData[i].start,
      id: eventsData[i].id,
      banner: eventsData[i].banner,
      host: eventsData[i].host
    }

    pageData.events.push(event);
  }

  //Fetch all online controllers
  const onlineData = await prisma.controllerSession.findMany({
    orderBy: {
      start: 'desc'
    },
    where: {
      active: true
    }
  })

  // Sanitize and push data
  for (let i = 0; i < onlineData.length; i++) {
    const member = await prisma.roster.findFirst({
      where: {
        cid: onlineData[i].cid
      },
      select: {
        firstName: true,
        lastName: true
      }
    });
    let controller: OnlineController = {
      firstName: member.firstName,
      lastName: member.lastName,
      callsign: onlineData[i].callsign,
      logon: onlineData[i].start
    }

    pageData.online.push(controller);
  }


  return {pageData: { ...pageData }};
}

class PageData {
  stats: MtdStats[];
  totalHours: string;
  newControllers: NewController[];
  events: Event[];
  online: OnlineController[];
  constructor() {
    this.stats = [];
    this.newControllers = [];
    this.events = [];
    this.online = [];
    this.totalHours = getHours(0);
  }
};

type MtdStats = {
  hours: string;
  firstName: string;
  lastName: string;
}

type NewController = {
  firstName: string;
  lastName: string;
  rating: string;
  joined: Date;
}

type Event = {
  name: string;
  start: Date;
  id: number;
  banner: string;
  host: string;
}

type OnlineController = {
  firstName: string;
  lastName: string;
  callsign: string;
  logon: Date;
}