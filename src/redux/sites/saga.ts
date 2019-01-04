import { generate, Options } from "generate-password-browser";
import { NavigationActions, NavigationRoute, NavigationState } from "react-navigation";
import { Action } from "redux";
import { call, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import uuid from 'uuid/v4';
import { ApplicationState } from "..";
import { openDatabase } from "../../encryptedDB";
import { mapSiteToModel } from "../../encryptedDB/schema";
import { back, navigate, Screen } from "../../navigation";
import { ActionWithPayload } from "../actions";
import { SyncAction } from "../sync";
import { regeneratePassword, requestPasswordRegen, sitePrepared, SitesAction } from "./";
import { getSiteById } from "./selectors";
import { Site } from "./state";

function* whenSitePressed() {
    yield call(navigate, Screen.SiteForm);
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
    yield call(navigate, Screen.SiteForm);
}

function* whenGeneratePasswordPressed(action: Action) {
    yield call(navigate, Screen.PasswordGenerator);
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
function* whenOpenPasswordGenerator() {
    yield put(regeneratePassword(generate(initialPswGenOptions)));
}

function* goBack() {
    yield call(back);
}

export default function* mySaga(): any {
    yield takeEvery(SitesAction.SitePressed, whenSitePressed);
    yield takeEvery(SitesAction.CreateSitePressed, whenCreateSitePressed);
    yield takeEvery(SitesAction.PswGenOpened, whenGeneratePasswordPressed);
    yield takeEvery(SitesAction.PswGenOpened, whenOpenPasswordGenerator);
    yield takeEvery(SitesAction.RequestPswRegen, whenRequestPasswordRegen);
    yield takeEvery([
        SitesAction.GenPswAccepted,
        SitesAction.SaveSitePressed,
        SitesAction.DeleteSite
    ], goBack);
    yield takeLatest(SyncAction.DBLoaded, siteDBSaga);
}

const getNavigationPath = (state: NavigationState | NavigationRoute): string => {
    const routeName = 'routeName' in state ? state.routeName : undefined;
    const key = 'key' in state ? state.key : undefined;
    const stepName = (routeName || key || '');

    if(state.index === undefined || !('routes' in state)) {
        return stepName;
    }

    return stepName + '.' + getNavigationPath(state.routes[state.index]);
}

function* takeBackWithExit() {
    // TODO Improve this... :/

    while(true) {
        const action = yield take(NavigationActions.BACK);
        if(getNavigationPath(action.metadata.nextNavigationState) !== '.Main.SiteForm') {
            return action;
        }
    }
}

const performWrite = (realm: Realm, fn: () => void) => call([realm, realm.write], () => {
    try {
        fn();
    }catch (ex) {
        console.error(ex);
    }
});

function* siteDBSaga(action: ActionWithPayload) {
    const { password } = action.payload;

    while(true) {
        const startEditAction: ActionWithPayload = yield take([
            SitesAction.NewSitePrepared,
            SitesAction.SitePressed
        ]);

        const siteBeingEdited = startEditAction.payload.site.id;

        const result = yield race({
            cancelled: call(takeBackWithExit),
            upserted: take([SitesAction.SaveSitePressed, SitesAction.DeleteSite]),
        });

        if(result.cancelled) {
            continue;
        }

        const realm: Realm = yield call(openDatabase, password);
        try {
            const updatedSite: Site = yield select<ApplicationState>(state => getSiteById(state, siteBeingEdited));
            const model = mapSiteToModel(updatedSite);
            yield performWrite(realm, () => {
                realm.create('Site', model, true);
            });
        } catch(ex) {
            console.warn(ex);
        } finally {
            yield call([realm, realm.close]);
        }
    }
}
