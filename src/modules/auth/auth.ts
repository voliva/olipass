import { bind } from "@react-rxjs/core";
import { merge, Subject } from "rxjs";
import { filter, map, withLatestFrom, tap } from "rxjs/operators";
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

const [, login$] = bind(
  authLogin.pipe(
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
    })
  )
);

const [, create$] = bind(
  authCreate.pipe(
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
  )
);

const [, loginResult$] = bind(
  login$.pipe(
    filter(({ result }) => result === "success"),
    withLatestFrom(authLogin),
    map(([login, password]) => ({
      database: login.database as DB,
      password,
    }))
  )
);
const [, createResult$] = bind(
  create$.pipe(
    filter(({ result }) => result === "success"),
    withLatestFrom(authCreate),
    map(([creation, password]) => ({
      database: creation.database,
      password,
    }))
  )
);

export const [, password$] = bind(
  merge(loginResult$, createResult$).pipe(map(({ password }) => password))
);
export const [, loginDB$] = bind(
  merge(loginResult$, createResult$).pipe(map(({ database }) => database))
);
export const [, error$] = bind(
  login$.pipe(
    filter(({ result }) => result === "error"),
    map(() => void 0)
  )
);

export const [, authRedirect] = bind(
  password$.pipe(tap(() => history.replace(getScreenRoutePath(Screen.Main))))
);
