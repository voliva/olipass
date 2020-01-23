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
  lastVisitAt?: Date;
  deletedAt?: Date;
  usernameUpdtAt: Date;
  passwordUpdtAt: Date;
  notesUpdtAt: Date;
}
export interface DB {
  sites: Site[];
}

const getEncryptedDB = () => localStorage.getItem(lsKey);

export const hasDatabase = () => !!getEncryptedDB();

export const loadDB = (password: string) =>
  decryptDatabase(getEncryptedDB() || "", password);
export const upsertDB = (newDB: DB, password: string) =>
  localStorage.setItem(lsKey, encryptDatabase(newDB, password));

function encryptDatabase(local: DB, password: string): string {
  const rawStringDB = JSON.stringify(local);
  const deflatedString = pako.deflate(rawStringDB, { to: "string" });
  const encryptedDB = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(deflatedString),
    password
  );
  return encryptedDB.toString();
}

function decryptDatabase(encryptedDB: string, password: string): DB {
  const deflatedString: string = CryptoJS.AES.decrypt(
    encryptedDB,
    password
  ).toString(CryptoJS.enc.Utf8);
  const rawStringDB = pako.inflate(deflatedString, { to: "string" });
  return JSON.parse(rawStringDB);
}
