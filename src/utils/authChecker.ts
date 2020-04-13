// External Dependencies
import { AuthChecker } from "type-graphql";

// Internal Dependencies
import { Context } from "../types/context";

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { req: { userId, userRoles } } }, roles) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only is user exist
    return userId !== undefined;
  }
  // there are some roles defined now

  if (!userId) {
    // and if no user, restrict access
    return false;
  }
  if (userRoles?.some(role => roles.includes(role))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
