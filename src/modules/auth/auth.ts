import {
  createStandardAction,
  createStore,
  filterAction
} from "@voliva/react-observable";
import { merge } from "rxjs";
import { ignoreElements, map, tap } from "rxjs/operators";
import { getScreenRoutePath, history, Screen } from "src/router";
import { DB, loadDB, upsertDB } from "src/services/encryptedDB";

const lsKey = "passDB";

export const authLogin = createStandardAction<string>("auth login");
export const authSuccess = createStandardAction<{
  password: string;
  database: DB;
}>("auth success");
export const authError = createStandardAction("auth error");
export const authCreate = createStandardAction<string>("auth create");

export const [getPassword, authStore] = createStore(
  null! as string,
  (state, action) =>
    authSuccess.isCreatorOf(action) ? action.payload.password : state,
);

authStore.addEpic(action$ => {
  if (localStorage.getItem(lsKey)) {
    history.replace(getScreenRoutePath(Screen.Login));
  } else {
    history.replace(getScreenRoutePath(Screen.Register));
  }

  const login$ = action$.pipe(
    filterAction(authLogin),
    map(action => {
      const password = action.payload;
      try {
        const database = loadDB(password);
        return authSuccess({
          password,
          database
        });
      } catch (ex) {
        console.error(ex);
        return authError();
      }
    })
  );

  const create$ = action$.pipe(
    filterAction(authCreate),
    map(action => {
      const password = action.payload;
      const database: DB = {
        sites: []
      };
      upsertDB(database, password);
      return authSuccess({
        password,
        database
      });
    })
  );

  const success$ = action$.pipe(
    filterAction(authSuccess),
    tap(() => history.replace(getScreenRoutePath(Screen.Main))),
    ignoreElements()
  );

  return merge(login$, create$, success$);
});
