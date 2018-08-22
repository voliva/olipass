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
    // const db: SOWDatabase = {
    //   sites: [createSite(), createSite(),createSite(),createSite(),createSite()],
    //   notes: [createNote(),createNote(),createNote(),createNote(),createNote()]
    // };

    // const encrypted = encryptDatabase(db, 'myPassword');
    // const decrypted = decryptDatabase(encrypted, 'myPassword');
    // console.log(decrypted);
    // try {
    //   const decrypted2 = decryptDatabase(encrypted, 'myWrongPassword');
    //   console.log(decrypted2);
    // }catch(ex) {
    //   console.error(ex);
    // }
  }

  public get hasDB(): boolean { // If false, will prompt user for new DB
    return !!localStorage.getItem(localStorageToken);
  }

  public get isDecrypted(): boolean {
    return !!this.database;
  }

  public setMasterPassword(masterPassword: string) {
    if(this.hasDB) {
      try {
        this.database = decryptDatabase(localStorage.getItem(localStorageToken), masterPassword);
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

  public getDB() {
    return this.database;
  }

  public setDB(db: SOWDatabase) {
    if(!this.masterPassword) {
      throw new Error('Must set password first');
    }
    const encryptedDatabase = encryptDatabase(db, this.masterPassword);
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

// const createSite = (): Site => ({
//   ...createTiming(),
//   id: 'asdf',
//   name: 'asdf',
//   website: 'asdf',
//   credentials: createSecret(),
//   tags: ['asdf'],
//   notes: 'asdf',
//   secrets: [createSecret(),createSecret(),createSecret()]
// });

// const createTiming = () => ({
//   createdAt: 123,
//   updatedAt: 234,
//   lastVisitAt: 345,
//   deletedAt: 456,
// });

// const createSecret = () => ({
//   ...createTiming(),
//   name: 'asdf',
//   secret: 'fdsa'
// });

// const createNote = () => ({
//   ...createSecret(),
//   id: 'asdf'
// });
