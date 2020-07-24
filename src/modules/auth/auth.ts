import { bind } from "@react-rxjs/core";
import { merge, Subject } from "rxjs";
import { filter, map, withLatestFrom } from "rxjs/operators";
import { getScreenRoutePath, history, Screen } from "src/router";
import { DB, loadDB, upsertDB } from "src/services/encryptedDB";

const lsKey = "passDB";

if (localStorage.getItem(lsKey)) {
  history.replace(getScreenRoutePath(Screen.Login));
} else {
  history.replace(getScreenRoutePath(Screen.Register));
}

export const authLogin = new Subject<string>();
export const authCreate = new Subject<string>();

const [, login$] = bind(
  authLogin.pipe(
    map((password) => {
      try {
        const database = loadDB(password);
        return {
          result: "success",
          database,
        };
      } catch (ex) {
        console.error(ex);
        return {
          result: "error",
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
      };
      upsertDB(database, password);
      return {
        result: "success",
        database,
      };
    })
  )
);

const loginPassword$ = login$.pipe(
  filter(({ result }) => result === "success"),
  withLatestFrom(authLogin),
  map(([_, password]) => password)
);
const createPassword$ = create$.pipe(
  filter(({ result }) => result === "success"),
  withLatestFrom(authCreate),
  map(([_, password]) => password)
);

export const [, password$] = bind(merge(loginPassword$, createPassword$));
export const [, error$] = bind(
  login$.pipe(
    filter(({ result }) => result === "error"),
    map(() => void 0)
  )
);

password$.subscribe(() => {
  // TODO move this to a `history` module?
  history.replace(getScreenRoutePath(Screen.Main));
});
