import UserService from "@repo/services/user";
import FormService from "@repo/services/form";
import FormResponseService from "@repo/services/form-response";

export const userService = new UserService();
export const formService = new FormService();
export const formResponseService = new FormResponseService();
