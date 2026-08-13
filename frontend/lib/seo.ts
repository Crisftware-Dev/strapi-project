import { cache } from "react";
import { getLoginPage } from "./login-register";

export const getLoginPageCached = cache(getLoginPage);

export const noIndexMeta = {
  robots: { index: false, follow: false },
};
