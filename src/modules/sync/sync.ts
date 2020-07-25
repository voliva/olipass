import { bind } from "@react-rxjs/core";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { defer, Subject } from "rxjs";
import {
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
  share,
} from "rxjs/operators";
import { decryptDatabase, encryptDatabase } from "src/services/encryptedDB";
import { password$ } from "../auth/auth";
import { allSites$ } from "../sites/sites";
import { addDebugTag } from "rxjs-traces";

export const exportDatabase = new Subject<void>();
export const [, databaseExporter] = bind(
  exportDatabase.pipe(
    withLatestFrom(
      password$,
      defer(() => allSites$)
    ),
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

export const uploadFile = new Subject<{
  password?: string;
  file: File;
}>();

const loadResult$ = uploadFile.pipe(
  withLatestFrom(password$),
  map(([{ password, file }, oldPassword]) => ({
    password: password ?? oldPassword,
    file,
  })),
  switchMap(({ file, password }) =>
    blobToBase64(file).then((data) => ({ data, password }))
  ),
  map(({ data, password }) => {
    try {
      return {
        type: "success" as const,
        db: decryptDatabase(data, password!),
      };
    } catch (ex) {
      console.error(ex);
      return {
        type: "error" as const,
        error: "Wrong password or invalid file",
      };
    }
  }),
  addDebugTag("loadResult$"),
  share()
);

export const uploadError$ = loadResult$.pipe(
  filter((v) => v.type === "error"),
  map((v) => v.error!)
);

export const loadedDB$ = loadResult$.pipe(
  filter((v) => v.type === "success"),
  map((v) => v.db!),
  addDebugTag("sync_loadedDB$")
);

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
