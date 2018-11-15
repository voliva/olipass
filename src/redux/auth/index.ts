import { always } from "ramda";
import { combineReducers } from "redux";
import { createAction } from "redux-actions";
import rereducer from "rereducer";
import path from "ramda/es/path";

export enum PasswordsAction {
    Register = 'Register',
    Login = 'Login',
    LoginFailed = 'LoginFailed',
    LoginFailedEx = 'LoginFailedEx',
}

export const register = createAction(PasswordsAction.Register, (password: string) => ({password}));
export const login = createAction(PasswordsAction.Login, (password: string) => ({password}));
export const loginFailed = createAction(PasswordsAction.LoginFailed, () => void 0);
export const loginFailedExpired = createAction(PasswordsAction.LoginFailedEx, () => void 0);

const loginFailedReducer = rereducer(
    false,
    [PasswordsAction.LoginFailed, () => {
        console.log('login failed');
        return true;
    }], // always(true)],
    [PasswordsAction.LoginFailedEx, always(false)]
);

export const hasFailedLogin = path<boolean>(['auth', 'loginFailed']);

export default combineReducers({
    loginFailed: loginFailedReducer
});
