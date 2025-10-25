const VERSION = "v1";

export const SESSION_ROUTES = {
  GET_ALL: `/${VERSION}/sessions`,
  GET_BY_ID: (id: string) => `/${VERSION}/sessions/${id}`,
  GET_BY_SLUG: (slug: string) => `/${VERSION}/sessions/slug/${slug}`,
  CREATE: `/${VERSION}/sessions`,
  UPDATE: (id: string) => `/${VERSION}/sessions/${id}`,
  DELETE: (id: string) => `/${VERSION}/sessions/${id}`,
  
  // Session participants
  JOIN: (sessionId: string) => `/${VERSION}/sessions/${sessionId}/join`,
  LEAVE: (sessionId: string) => `/${VERSION}/sessions/${sessionId}/leave`,
  PARTICIPANTS: (sessionId: string) => `/${VERSION}/sessions/${sessionId}/participants`,
  
  // My sessions
  MY_SESSIONS: `/${VERSION}/sessions/my-sessions`,
};
