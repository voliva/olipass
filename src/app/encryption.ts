import { SOWDatabase } from "./database";
import * as pako from 'pako';

declare var CryptoJS: any;

export function encryptDatabase(local: SOWDatabase, password: string): string {
    const rawStringDB = JSON.stringify(local);
    const deflatedString = pako.deflate(rawStringDB, { to: 'string' });;
    const encryptedDB = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(deflatedString), password);
    return encryptedDB.toString();
}

export function decryptDatabase(encryptedDB: string, password: string) {
    const deflatedString:string = CryptoJS.AES.decrypt(encryptedDB, password).toString(CryptoJS.enc.Utf8);
    const rawStringDB = pako.inflate(deflatedString, { to: 'string' });
    return JSON.parse(rawStringDB);
}
