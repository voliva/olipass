import { generate, Options } from "generate-password-browser";
import { Action } from "redux";
import { put, takeEvery } from "redux-saga/effects";
import { navigate, Screen, back } from "../../navigation";
import { regeneratePassword, sitePressed, SitesAction, requestPasswordRegen, generatePasswordPressed, sitePrepared } from "./";
import uuid from 'uuid/v4'

function* whenSitePressed() {
    yield navigate(Screen.SiteForm);
}
function* whenCreateSitePressed() {
    yield put(sitePrepared({
        id: uuid(),
        deletedAt: null,
        notes: '',
        name: '',
        password: '',
        updatedAt: new Date().getTime(),
        username: '',
        website: ''
    }));
    yield navigate(Screen.SiteForm);
}

function* whenGeneratePasswordPressed(action: Action) {
    yield navigate(Screen.PasswordGenerator);
}

function* whenRequestPasswordRegen(action: ReturnType<typeof requestPasswordRegen>) {
    yield put(regeneratePassword(generate(action.payload.options)));
}

export const initialPswGenOptions: Options = {
    length: 8,
    uppercase: false,
    numbers: false,
    symbols: false,
    strict: true
}
function* whenOpenPasswordGenerator(action: ReturnType<typeof generatePasswordPressed>) {
    yield put(regeneratePassword(generate(initialPswGenOptions)));
}

function* whenAcceptGeneratedPsw() {
    yield back();
}

function* whenSaveSitePressed() {
    yield back();
}

export default function* mySaga(): any {
    yield takeEvery(SitesAction.SitePressed, whenSitePressed);
    yield takeEvery(SitesAction.CreateSitePressed, whenCreateSitePressed);
    yield takeEvery(SitesAction.PswGenOpened, whenGeneratePasswordPressed);
    yield takeEvery(SitesAction.PswGenOpened, whenOpenPasswordGenerator);
    yield takeEvery(SitesAction.RequestPswRegen, whenRequestPasswordRegen);
    yield takeEvery(SitesAction.GenPswAccepted, whenAcceptGeneratedPsw);
    yield takeEvery(SitesAction.SaveSitePressed, whenSaveSitePressed);
}
