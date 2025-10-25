import { ADMIN_ROUTES } from "./modules/admin.routes";
import { CALL_ROUTES } from "./modules/call.routes";
import { COURSE_ROUTES } from "./modules/course.routes";
import { INSTRUCTOR_ROUTES } from "./modules/instructor.routes";
import { STATIC_ROUTES } from "./modules/static.routes";
import { USER_ROUTES } from "./modules/user.routes";

export const CLIENT_ROUTES = {
  ADMIN: ADMIN_ROUTES,
  CALL: CALL_ROUTES,
  COURSE: COURSE_ROUTES,
  INSTRUCTOR: INSTRUCTOR_ROUTES,
  STATIC: STATIC_ROUTES,
  USER: USER_ROUTES,
};
