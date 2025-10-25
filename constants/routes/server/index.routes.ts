import { AUTH_ROUTES } from "./modules/auth.routes";
import { COURSE_ROUTES } from "./modules/course.routes";
import { GIG_ROUTES } from "./modules/gig.routes";
import { INSTRUCTOR_ROUTES } from "./modules/instructor.routes";
import { SESSION_ROUTES } from "./modules/session.routes";
import { USER_ROUTES } from "./modules/user.routes";

export const SERVER_ROUTES = {
  AUTH: AUTH_ROUTES,
  COURSE: COURSE_ROUTES,
  GIG: GIG_ROUTES,
  INSTRUCTOR: INSTRUCTOR_ROUTES,
  SESSION: SESSION_ROUTES,
  USER: USER_ROUTES,
};
