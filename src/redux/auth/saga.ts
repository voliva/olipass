import { Action } from "redux";
import { fork, put, takeEvery } from "redux-saga/effects";
import { AuthAction } from ".";
import { navigate, Screen } from "../../navigation";
import { dbLoaded } from "../sync";
import { PasswordDB } from "../sync/state";

function* initSaga() {
    /* TODO Fetch state from local database (realm.io) - If we have database, navigate to register, else navigate to login
    It's not compatible with expo, so I'll just mock it here.
    */
    yield put(dbLoaded({
        sites: [{
            id: 'id',
            name: 'name',
            website: 'website',
            username: {
                updatedAt: new Date().getTime(),
                value: 'username'
            },
            password: {
                updatedAt: new Date().getTime(),
                value: 'password'
            },
            notes: {
                updatedAt: new Date().getTime(),
                value: 'notes'
            },
            updatedAt: new Date().getTime(),
            deletedAt: null
        }]
    }))
    // yield navigateReplace(Screen.Login);
    yield navigate(Screen.SiteList);
}

const emptyDatabase: PasswordDB = {
    sites: [],
    // notes: []
}
function* createDB(action: Action) {
    /* TODO create a new DB and, if successful, navigate to SiteList */
    yield put(dbLoaded(emptyDatabase));
    yield navigate(Screen.SiteList);
}

function* login(action: Action) {
    /* TODO try to decrypt the database with the password, if successful, navigate to SiteList */

    yield put(dbLoaded(emptyDatabase));
    yield navigate(Screen.SiteList);

    // We can actually use react-native-simple-toast when we unlink expo, and basically use as a side effect, without emiting an extra redux action
    // yield put(loginFailed());
    // yield delay(2000);
    // yield put(loginFailedExpired());
}

export default function* mySaga(): any {
    yield fork(initSaga);
    yield takeEvery(AuthAction.Register, createDB);
    yield takeEvery(AuthAction.Login, login);
}
