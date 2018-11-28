import { fork } from "redux-saga/effects";
import authSaga from './auth/saga';
import sitesSaga from './sites/saga';

export default function* mySaga(): any {
    yield fork(authSaga);
    yield fork(sitesSaga);
}