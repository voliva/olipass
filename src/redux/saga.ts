import { fork } from "redux-saga/effects";
import authSaga from './auth/saga';
import uiSaga from './ui/saga';

export default function* mySaga(): any {
    yield fork(authSaga);
    yield fork(uiSaga);
}