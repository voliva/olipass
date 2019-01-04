import { delay } from "redux-saga";
import { call, fork, put, takeEvery } from "redux-saga/effects";
import { AuthAction, loginFailed, loginFailedExpired } from ".";
import { encryptedDbExsits, tryPassword, openDatabase } from '../../encryptedDB';
import { navigate, navigateReplace, Screen } from "../../navigation";
import { ActionWithPayload } from "../actions";
import { dbLoaded } from "../sync";
import { PasswordDB } from "../sync/state";
import { mapModelToSite } from "../../encryptedDB/schema";
import { Site } from "../sites/state";

function* initSaga() {
    const dbExists = yield call(encryptedDbExsits);

    if(dbExists) {
        yield call(navigateReplace, Screen.Login);
    }else {
        yield call(navigateReplace, Screen.Register);
    }

    /* TODO Fetch state from local database (realm.io) - If we have database, navigate to register, else navigate to login
    It's not compatible with expo, so I'll just mock it here.
    */
    /*yield put(dbLoaded({
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
    yield call(navigate, Screen.SiteList);*/
}

const emptyDatabase: PasswordDB = {
    sites: [],
    // notes: []
}
function* createDB(action: ActionWithPayload) {
    const dbExists = yield call(encryptedDbExsits);

    if(dbExists) {
        console.warn('TODO DB exists, refusing to replace it');
        return;
    }

    const { password } = action.payload;

    // Create database
    const realm = yield call(openDatabase, password);
    realm.close();

    yield put(dbLoaded(emptyDatabase, password));
    yield call(navigate, Screen.SiteList);
}

function* login(action: ActionWithPayload) {
    const { password } = action.payload;
    const passwordWorked = yield call(tryPassword, password);

    if(passwordWorked) {
        const realm: Realm = yield call(openDatabase, password);
        try {
            const siteModels: Realm.Results<any> = yield call([realm, realm.objects], 'Site');
            const sites: Site[] = yield call([siteModels, siteModels.map], mapModelToSite);

            yield put(dbLoaded({
                sites
            }, password));
            yield call(navigate, Screen.SiteList);
        } catch(ex) {
            console.error(ex);
        } finally {
            realm.close();
        }
    }else {
        // We can actually use react-native-simple-toast when we unlink expo, and basically use as a side effect, without emiting an extra redux action
        yield put(loginFailed());
        yield delay(2000);
        yield put(loginFailedExpired());
    }
}

export default function* mySaga(): any {
    yield fork(initSaga);
    yield takeEvery(AuthAction.Register, createDB);
    yield takeEvery(AuthAction.Login, login);
}
