import { always } from "ramda";
import path from "ramda/es/path";
import { combineReducers } from "redux";
import rereducer from "rereducer";
import { createAction } from "../actions";

export enum AuthAction {
    Register = 'Register',
    Login = 'Login',
    LoginFailed = 'LoginFailed',
    LoginFailedEx = 'LoginFailedEx',
}

export const register = (password: string) => createAction(AuthAction.Register, {password});
export const login = (password: string) => createAction(AuthAction.Login, {password});
export const loginFailed = () => createAction(AuthAction.LoginFailed);
export const loginFailedExpired = () => createAction(AuthAction.LoginFailedEx);

const loginFailedReducer = rereducer(
    false,
    [AuthAction.LoginFailed, always(true)],
    [AuthAction.LoginFailedEx, always(false)]
);

export const hasFailedLogin = path<boolean>(['auth', 'loginFailed']);

export default combineReducers({
    loginFailed: loginFailedReducer
});
