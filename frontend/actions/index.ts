import { changePasswordAction, loginUserAction, registerUserAction } from "./auth";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    changePasswordAction,
  }
} 