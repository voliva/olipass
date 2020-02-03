import {
  createSelector,
  createStatelessStore,
  filterAction,
  ReadSelectorFnType
} from "@voliva/react-observable";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import {
  ignoreElements,
  map,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs/operators";
import {
  decryptDatabase,
  encryptDatabase,
  Site,
  upsertDB
} from "src/services/encryptedDB";
import { getPassword } from "../auth/auth";
import { getDeletedSites, getSiteList, upsertSite } from "../sites/sites";
import {
  exportDatabase,
  uploadError,
  uploadFile,
  uploadSuccess
} from "./actions";

const getAllSites = createSelector(
  [getSiteList, getDeletedSites],
  (sites, deleted) => sites.concat(deleted)
);

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

syncStore.addEpic((action$, readSelector) =>
  action$.pipe(
    filterAction(exportDatabase),
    map(
      () =>
        [
          readSelector(getPassword).getValue(),
          readSelector(getAllSites).getValue()
        ] as [string, Site[]]
    ),
    map(([password, sites]) => {
      const encryptedDb = encryptDatabase(
        {
          sites
        },
        password
      );
      const blob = b64toBlob(encryptedDb, "application/octet-stream");
      const filename = format(Date.now(), "yyyyMMdd") + ".psw";
      saveAs(blob, filename);
    }),
    ignoreElements()
  )
);

const mergeDatabase = (database: any, readSelector: ReadSelectorFnType) => {
  if (!Array.isArray(database.sites)) {
    return uploadError("Unkown format");
  }

  try {
    const newSites = mergeSites(
      readSelector(getAllSites).getValue(),
      database.sites
    );
    return uploadSuccess({
      sites: newSites
    });
  } catch (ex) {
    return uploadError("Unkown format");
  }
};

const mergeSite = (local: Site, merging: any): Site => {
  const ret = {
    ...local
  };

  if (local.updatedAt < new Date(merging.updatedAt)) {
    ret.name = merging.name;
    ret.website = merging.website;
    ret.updatedAt = new Date(merging.updatedAt);
  }

  if (local.usernameUpdtAt < new Date(merging.usernameUpdtAt)) {
    ret.username = merging.username;
    ret.usernameUpdtAt = new Date(merging.usernameUpdtAt);
  }

  if (local.passwordUpdtAt < new Date(merging.passwordUpdtAt)) {
    ret.password = merging.password;
    ret.passwordUpdtAt = new Date(merging.passwordUpdtAt);
  }

  if (local.notesUpdtAt < new Date(merging.notesUpdtAt)) {
    ret.notes = merging.notes;
    ret.notesUpdtAt = new Date(merging.notesUpdtAt);
  }

  if (merging.deletedAt) {
    ret.deletedAt = new Date(merging.deletedAt);
  }

  return ret;
};

const requiredSiteFields: Array<keyof Site> = [
  "id",
  "updatedAt",
  "usernameUpdtAt",
  "passwordUpdtAt",
  "notesUpdtAt"
];
const mergeSites = (local: Site[], merging: any[]): Site[] => {
  const result = [...local];
  merging.forEach(mergingSite => {
    if (!requiredSiteFields.every(key => key in mergingSite)) {
      throw new Error("missing field id in site");
    }
    const idx = result.findIndex(({ id }) => id === mergingSite.id);
    if (idx < 0) {
      result.push(mergingSite);
    } else {
      result[idx] = mergeSite(result[idx], mergingSite);
    }
  });
  return result;
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
