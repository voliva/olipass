import { Injectable } from '@angular/core';
import { encryptDatabase, decryptDatabase } from './encryption';
import { SOWDatabase } from './database';

const localStorageToken = 'passDB';
@Injectable({
  providedIn: 'root'
})
export class PasswordsService {
  // TODO Fingerprint support
  private masterPassword: string = null;
  private database: SOWDatabase = null;

  constructor() {
  }

  public getEncryptedDB() {
    return localStorage.getItem(localStorageToken);
  }

  public get hasDB(): boolean { // If false, will prompt user for new DB
    return !!this.getEncryptedDB();
  }

  public get isDecrypted(): boolean {
    return !!this.database;
  }

  public setMasterPassword(masterPassword: string) {
    if(this.hasDB) {
      try {
        this.database = decryptDatabase(this.getEncryptedDB(), masterPassword);
      } catch (ex) {
        console.log(ex);
        return false;
      }
      this.masterPassword = masterPassword;
      return true;
    }

    this.masterPassword = masterPassword;
    this.setDB({
      sites: [],
      notes: []
    });
    return true;
  }

  public getMasterPassword() {
    return this.masterPassword;
  }

  public getDB() {
    return this.database;
  }

  public setDB(db: SOWDatabase) {
    if(!this.masterPassword) {
      throw new Error('Must set password first');
    }
    const encryptedDatabase = encryptDatabase(db, this.masterPassword);
    console.warn('encryptedDatabase length', encryptedDatabase.length);
    localStorage.setItem(localStorageToken, encryptedDatabase);
    this.database = db;
    return this;
  }

  public clearDB() {
    this.database = null;
    localStorage.removeItem(localStorageToken);
    return this;
  }
}
