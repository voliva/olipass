import { fork, takeEvery, put } from "redux-saga/effects";
import { navigateReplace, Screen, navigate } from "../navigation";
import { PasswordsAction, dbLoaded } from "./passwords";
import { Action } from "redux";
import { PasswordsState } from "./passwords/state";

function* initSaga() {
    /// TODO Fetch from local database (realm.io). It's not compatible with expo, so I'll just mock it here.
    yield navigateReplace(Screen.Register);
}

const emptyDatabase: PasswordsState = {
    sites: [],
    notes: []
}
function* createDB(action: Action) {
    yield put(dbLoaded(emptyDatabase));
    yield navigate(Screen.SiteList);
}

export default function* mySaga(): any {
    yield fork(initSaga);
    yield takeEvery(PasswordsAction.CreateNewDB, createDB);
}