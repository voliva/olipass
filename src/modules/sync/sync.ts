import { bind } from "@react-rxjs/core";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { combineLatest, defer, Subject } from "rxjs";
import { filter, map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { createStandardAction } from "src/lib/storeHelpers";
import {
  DB,
  decryptDatabase,
  encryptDatabase,
  Site,
  upsertDB,
} from "src/services/encryptedDB";
import { password$ } from "../auth/auth";
import * as sites from "../sites/sites";

export const uploadFile = new Subject<{
  password?: string;
  file: File;
}>();
export const exportDatabase = new Subject<void>();

const allSites$ = combineLatest(
  defer(() => sites.deletedSite$),
  defer(() => sites.siteList$)
).pipe(map(([deleted, sites]) => sites.concat(deleted)));

export const [, databasePersistence] = bind(
  allSites$.pipe(
    withLatestFrom(password$),
    tap(([sites, password]) => {
      upsertDB(
        {
          sites,
        },
        password
      );
    })
  )
);

const uploadError = createStandardAction<string>("upload error");
const uploadSuccess = createStandardAction<DB>("upload success");

const [, mergeResult$] = bind(
  uploadFile.pipe(
    withLatestFrom(password$),
    map(([{ password, file }, oldPassword]) => ({
      password: password ?? oldPassword,
      file,
    })),
    switchMap(({ file, password }) =>
      blobToBase64(file).then((data) => ({ data, password }))
    ),
    withLatestFrom(allSites$),
    map(([{ data, password }, allSites]) => {
      try {
        const decrypted = decryptDatabase(data, password!);
        return mergeDatabase(allSites, decrypted);
      } catch (ex) {
        return uploadError("Wrong password or invalid file");
      }
    })
  )
);

export const [, uploadError$] = bind(
  mergeResult$.pipe(
    filter(uploadError.isCreatorOf),
    map((v) => v.payload)
  )
);
export const [, uploadSuccess$] = bind(
  mergeResult$.pipe(
    filter(uploadSuccess.isCreatorOf),
    map((v) => v.payload)
  )
);

export const [, databaseExporter] = bind(
  exportDatabase.pipe(
    withLatestFrom(password$, allSites$),
    map(([_, password, sites]) => {
      const encryptedDb = encryptDatabase(
        {
          sites,
        },
        password
      );
      return b64toBlob(encryptedDb, "application/octet-stream");
    }),
    tap((blob) => {
      const filename = format(Date.now(), "yyyyMMdd") + ".psw";
      saveAs(blob, filename);
    })
  )
);

const mergeDatabase = (localSites: Site[], database: any) => {
  if (!Array.isArray(database.sites)) {
    return uploadError("Unkown format");
  }

  try {
    const newSites = mergeSites(localSites, database.sites);
    return uploadSuccess({
      sites: newSites,
    });
  } catch (ex) {
    return uploadError("Unkown format");
  }
};

const mergeSite = (local: Site, merging: any): Site => {
  const ret = {
    ...local,
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
  "notesUpdtAt",
];
const mergeSites = (local: Site[], merging: any[]): Site[] => {
  const result = [...local];
  merging.forEach((mergingSite) => {
    if (!requiredSiteFields.every((key) => key in mergingSite)) {
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
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(blob);
  }).then((buffer) => {
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
