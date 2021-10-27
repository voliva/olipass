import { bind, shareLatest } from "@react-rxjs/core";
import { Dictionary, keyBy } from "lodash";
import { merge, of, Subject } from "rxjs";
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
import uuid from "uuid/v4";
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

const site$ = loginSite$.pipe(
  switchMap((site) => merge(upsertedSite$, mergedSite$, of(site))),
  connectSites(),
  shareLatest()
);

export const [, allSites$] = bind(
  site$.pipe(map((sites) => Object.values(sites)))
);

export const [, databasePersistence] = bind(
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
  site$.pipe(map((sites) => sites[id]))
);

const localeIncludes = (base: string | undefined, substr: string) =>
  base && base.toLowerCase().includes(substr.toLowerCase());
export const [useFilteredSites] = bind((filter: string) =>
  siteList$.pipe(
    map((sites) =>
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
});
