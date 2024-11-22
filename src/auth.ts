import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/oauth";

export const authHandle = async ({ event, resolve}) => {
  const token = event.cookies.get("auth_session") ?? null;
  if (token === null) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(token);
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  event.locals.session = session;
  event.locals.user = user;
  return resolve(event);
}