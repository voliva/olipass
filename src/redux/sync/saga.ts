import { call, select, take, takeLatest, put } from "redux-saga/effects";
import { ActionWithPayload } from "../actions";
import { getAllSitesIncludingDeleted } from "../sites/selectors";
import { SyncAction, importNeedsPsw, importPswSubmitted } from "../sync";

import { DocumentPicker, DocumentPickerUtil, Result } from 'react-native-document-picker';
import * as pako from 'pako';
import { PermissionsAndroid } from "react-native";
import * as RNFS from 'react-native-fs';
import dateFormat from 'dateformat';
import { Action } from "redux";

declare var CryptoJS: any;

function requestStoragePermission() {
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ).then(granted => {
        if(!granted) {
            return Promise.reject<string>('not granted');
        }
        return granted;
    });
}

function generateFilename() {
    return RNFS.DownloadsDirectoryPath + "/" + dateFormat(new Date(), 'yyyymmdd') + '.psw';
}

function encryptDB(db: any, password: string) {
    const rawStringDB = JSON.stringify(db);
    const deflatedString = pako.deflate(rawStringDB, { to: 'string' });
    const encryptedDB = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(deflatedString), password);
    return encryptedDB.toString();
}

function decryptDatabase(encryptedDB: string, password: string) {
    const deflatedString:string = CryptoJS.AES.decrypt(encryptedDB, password).toString(CryptoJS.enc.Utf8);
    const rawStringDB = pako.inflate(deflatedString, { to: 'string' });
    return JSON.parse(rawStringDB);
}

function* exportDB(password: string) {
    try {        
        yield call(requestStoragePermission);

        const sites = yield select(getAllSitesIncludingDeleted);
        const notes: never[] = [];

        const sowDB = {
            sites,
            notes
        };

        const file = yield call(generateFilename);

        console.log('db to encrypt', sowDB, file);
        const payload = encryptDB(sowDB, password);
        console.log(payload);

        yield call([RNFS, RNFS.writeFile], file, payload, 'base64');

        console.log('complete :D');
    } catch (ex) {
        console.log(ex);
    }
}

function pickFile() {
    return new Promise<Result>((resolve, reject) => {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            if(error) {
                return reject(error);
            }
            resolve(res);
        });
    });
}

function *importDB(password: string) {
    try {
        const pickedFile: Result = yield call(pickFile);

        console.log('file to read', pickedFile);

        const fileContent = yield call([RNFS, RNFS.readFile], pickedFile.uri, 'base64');

        console.log('read! :D', fileContent);

        try {
            const decryptedDB = decryptDatabase(fileContent, password + '#');

            console.log('decrypted! :D', decryptedDB);
        } catch (ex) {
            yield put(importNeedsPsw());
            
            const action: ReturnType<typeof importPswSubmitted> = yield take(SyncAction.ImportPswSubmitted);
            const importPsw = action.payload.password;

            const decryptedDB = decryptDatabase(fileContent, importPsw);

            console.log('decrypted! :D', decryptedDB);
        }
    } catch (ex) {
        console.log(ex);
    }
}

function* siteDBSaga(action: ActionWithPayload) {
    const { password } = action.payload;

    while(true) {
        const action: Action = yield take([SyncAction.ExportPressed, SyncAction.ImportPressed]);
        if(action.type === SyncAction.ExportPressed)
            yield call(exportDB, password);
        else if(action.type === SyncAction.ImportPressed)
            yield call(importDB, password);
        else
            console.log(action);
    }
}

export default function* syncSaga(): any {
    yield takeLatest(SyncAction.DBLoaded, siteDBSaga);
}
