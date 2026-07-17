import { changePasswordAction, loginUserAction, registerUserAction } from "./auth";
import {
  createClientAction,
  updateClientAction,
  uploadFileAction,
  createPlanAction,
} from "./mutations";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    changePasswordAction,
  },
  mutations: {
    createClientAction,
    updateClientAction,
    uploadFileAction,
    createPlanAction,
  },
};