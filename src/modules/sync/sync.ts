import {
  createSelector,
  createStatelessStore,
  filterAction,
  createStandardAction,
  ReadSelectorFnType
} from "@voliva/react-observable";
import {
  ignoreElements,
  map,
  tap,
  withLatestFrom,
  switchMap
} from "rxjs/operators";
import { upsertDB, decryptDatabase } from "src/services/encryptedDB";
import { getPassword } from "../auth/auth";
import { getDeletedSites, getSiteList, upsertSite } from "../sites/sites";
import { of } from "rxjs";

const getAllSites = createSelector(
  [getSiteList, getDeletedSites],
  (sites, deleted) => sites.concat(deleted)
);

export const uploadFile = createStandardAction<{
  password?: string;
  file: File;
}>("upload file");
export const uploadSuccess = createStandardAction("upload success");
export const uploadError = createStandardAction<string>("upload error");

export const syncStore = createStatelessStore();

syncStore.addEpic((action$, readSelector) =>
  action$.pipe(
    filterAction(upsertSite),
    withLatestFrom(readSelector(getAllSites)),
    map(([, sites]) => sites),
    withLatestFrom(readSelector(getPassword)),
    tap(([sites, password]) => {
      upsertDB(
        {
          sites
        },
        password
      );
    }),
    ignoreElements()
  )
);

syncStore.addEpic((action$, readSelector) =>
  action$.pipe(
    filterAction(uploadFile),
    map(({ payload }) =>
      payload.password
        ? payload
        : {
            ...payload,
            password: readSelector(getPassword).getValue()
          }
    ),
    switchMap(({ file, password }) =>
      blobToBase64(file).then(data => ({ data, password }))
    ),
    map(({ data, password }) => {
      try {
        const decrypted = decryptDatabase(data, password!);
        return mergeDatabase(decrypted, readSelector);
      } catch (ex) {
        return uploadError("Wrong password or invalid file");
      }
    }),
    tap(console.log)
  )
);

const mergeDatabase = (database: any, readSelector: ReadSelectorFnType) => {
  return uploadError("Unkown format");
};

function blobToBase64(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      resolve(buffer);
    };
    reader.onerror = err => reject(err);
    reader.readAsArrayBuffer(blob);
  }).then(buffer => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  });
}

function b64toBlob(b64Data: string, contentType: string = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
