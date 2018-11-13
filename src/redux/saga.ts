import { fork, put } from "redux-saga/effects";
import { databaseLoaded } from "./passwords";

function* initSaga() {
    /// TODO Fetch from local database (realm.io). It's not compatible with expo, so I'll just mock it here.
    yield put(databaseLoaded(null));
}

export default function* mySaga(): any {
    fork(initSaga);
}