import { shareLatest } from "@react-rxjs/core";
import { merge, Subject } from "rxjs";
import { filter, map, tap, withLatestFrom } from "rxjs/operators";
import { getScreenRoutePath, history, Screen } from "src/router";
import { DB, loadDB, upsertDB } from "src/services/encryptedDB";

const lsKey = "passDB";

export function initialize() {
  if (localStorage.getItem(lsKey)) {
    history.replace(getScreenRoutePath(Screen.Login));
  } else {
    history.replace(getScreenRoutePath(Screen.Register));
  }
}

export const authLogin = new Subject<string>();
export const authCreate = new Subject<string>();

const login$ = authLogin.pipe(
  map((password) => {
    try {
      const database = loadDB(password);
      return {
        result: "success" as const,
        database,
      };
    } catch (ex) {
      console.error(ex);
      return {
        result: "error" as const,
      };
    }
  }),
  shareLatest()
);

const create$ = authCreate.pipe(
  map((password) => {
    const database: DB = {
      sites: [],
      version: 1,
    };
    upsertDB(database, password);
    return {
      result: "success" as const,
      database,
    };
  })
);

const loginResult$ = login$.pipe(
  filter(({ result }) => result === "success"),
  withLatestFrom(authLogin),
  map(([login, password]) => ({
    database: login.database as DB,
    password,
  }))
);
const createResult$ = create$.pipe(
  filter(({ result }) => result === "success"),
  withLatestFrom(authCreate),
  map(([creation, password]) => ({
    database: creation.database,
    password,
  }))
);

const authResult$ = merge(loginResult$, createResult$).pipe(shareLatest());

export const password$ = authResult$.pipe(
  map(({ password }) => password),
  shareLatest()
);
export const loginDB$ = authResult$.pipe(
  map(({ database }) => database),
  shareLatest()
);
export const error$ = login$.pipe(
  filter(({ result }) => result === "error"),
  map(() => void 0),
  shareLatest()
);

export const authRedirect = password$.pipe(
  tap(() => history.replace(getScreenRoutePath(Screen.Main)))
);
