import pako from "pako";

declare var CryptoJS: any;

const lsKey = "passDB";

export interface Site {
  id: string;
  name?: string;
  website?: string;
  username?: string;
  password?: string;
  notes?: string;
  updatedAt: Date;
  lastVisitAt: Date;
  deletedAt?: Date;
  usernameUpdtAt: Date;
  passwordUpdtAt: Date;
  notesUpdtAt: Date;
}
export interface DB {
  sites: Site[];
  version: number;
}

const getEncryptedDB = () => localStorage.getItem(lsKey);

export const hasDatabase = () => !!getEncryptedDB();

export const loadDB = (password: string) =>
  decryptDatabase(getEncryptedDB() || "", password);
export const upsertDB = (newDB: DB, password: string) =>
  localStorage.setItem(lsKey, encryptDatabase(newDB, password));

export function encryptDatabase(local: DB, password: string): string {
  const rawStringDB = JSON.stringify(local);
  const deflatedString = buf2binstring(pako.deflate(rawStringDB));
  const encryptedDB = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(deflatedString),
    password
  );
  return encryptedDB.toString();
}

export function decryptDatabase(encryptedDB: string, password: string): DB {
  const deflatedString: string = CryptoJS.AES.decrypt(
    encryptedDB,
    password
  ).toString(CryptoJS.enc.Utf8);
  const rawStringDB = pako.inflate(binstring2buf(deflatedString), {
    to: "string",
  });
  const decryptedJSON = JSON.parse(rawStringDB);
  const dateKeys = [
    "updatedAt",
    "lastVisitAt",
    "deletedAt",
    "usernameUpdtAt",
    "passwordUpdtAt",
    "notesUpdtAt",
  ];
  decryptedJSON.sites.forEach((site: any) => {
    dateKeys.forEach((key) => {
      if (key in site) {
        site[key] = new Date(site[key]);
      }
    });
  });
  return decryptedJSON;
}

// From https://github.com/nodeca/pako/blob/master/lib/utils/strings.js after they deprecated it
const buf2binstring = (buf: Uint8Array) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (buf.length < 65534) {
    if ("subarray" in buf) {
      return String.fromCharCode.apply(null, buf as any);
    }
  }

  let result = "";
  for (let i = 0; i < buf.length; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};
const binstring2buf = function (str: string) {
  var buf = new Uint8Array(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};
