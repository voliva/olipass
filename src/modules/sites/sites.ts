import { bind, state } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { Dictionary, keyBy } from "lodash";
import { merge, of, Subject, combineLatest } from "rxjs";
import { addDebugTag } from "rxjs-traces";
import {
  filter,
  map,
  share,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { recursiveObservable } from "src/lib/storeHelpers";
import { Site, upsertDB } from "src/services/encryptedDB";
import { mergeDatabase } from "src/services/mergeDB";
import { v4 as uuid } from "uuid";
import { loginDB$, password$ } from "../auth/auth";
import { loadedDB$ } from "../sync/sync";

const [_site$, connectSites] = recursiveObservable<Dictionary<Site>>();

export const upsertSite = new Subject<Site>();
const upsertedSite$ = upsertSite.pipe(
  withLatestFrom(_site$),
  map(([newSite, sites]) => ({
    ...sites,
    [newSite.id]: newSite,
  })),
  addDebugTag("upsertedSite$")
);

const mergedSiteResult$ = loadedDB$.pipe(
  withLatestFrom(_site$),
  map(([db, sites]) => {
    try {
      return mergeDatabase(Object.values(sites), db);
    } catch (ex) {
      console.error(ex);
      return {
        error: ex,
      };
    }
  }),
  addDebugTag("mergedSiteResult$"),
  share()
);

export const mergedSite$ = mergedSiteResult$.pipe(
  filter((v) => "sites" in v),
  map((v) => (v as { sites: Site[] }).sites),
  map((sites) => keyBy(sites, "id"))
);
export const mergeError$ = mergedSiteResult$.pipe(
  filter((v) => "error" in v),
  map((v) => (v as { error: Error }).error)
);

const loginSite$ = loginDB$.pipe(map((db) => keyBy(db.sites, "id")));
const site$ = state(
  loginSite$.pipe(
    switchMap((site) => merge(upsertedSite$, mergedSite$, of(site))),
    addDebugTag("inner site$"),
    connectSites()
  )
);

export const allSites$ = state(
  site$.pipe(map((sites) => Object.values(sites)))
);

export const databasePersistence = state(
  allSites$.pipe(
    withLatestFrom(password$),
    tap(([sites, password]) => {
      upsertDB(
        {
          sites,
          version: 1,
        },
        password
      );
    })
  )
);

export const [useSiteList, siteList$] = bind(
  site$.pipe(
    map((sites) => Object.values(sites).filter((site) => !site.deletedAt))
  )
);

export const [useSite] = bind((id: string) =>
  site$.pipe(map((sites) => sites[id] as Site | undefined))
);

const [filter$, setFilter] = createSignal<string>();
export { setFilter };
export const filterState$ = state(filter$, "");

const localeIncludes = (base: string | undefined, substr: string) =>
  base && base.toLowerCase().includes(substr.toLowerCase());
export const filteredSites$ = state(
  combineLatest([
    siteList$.pipe(
      map((sites) =>
        sites.sort(
          (s1, s2) =>
            (s2.lastVisitAt?.getTime() ?? 0) - s1.lastVisitAt?.getTime() ?? 0
        )
      )
    ),
    filterState$,
  ]).pipe(
    map(([sites, filter]) =>
      sites.filter(
        ({ name, website, username, notes }) =>
          localeIncludes(name, filter) ||
          localeIncludes(website, filter) ||
          localeIncludes(username, filter) ||
          localeIncludes(notes, filter)
      )
    )
  )
);

export const createSite = (): Site => ({
  id: uuid(),
  notesUpdtAt: new Date(),
  passwordUpdtAt: new Date(),
  updatedAt: new Date(),
  usernameUpdtAt: new Date(),
  lastVisitAt: new Date(),
});
