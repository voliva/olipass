import { createBrowserHistory } from "history";

export enum Screen {
  Register = "register",
  Login = "login",
  Main = "main"
}

export function getScreenRoutePath(screen: Screen) {
  return "/" + screen;
}

export const history = createBrowserHistory();
