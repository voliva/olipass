import { bind } from "@react-rxjs/core";
import { keyBy } from "lodash";
import { defer, merge, Observable, Subject } from "rxjs";
import { map, scan, switchMap, startWith } from "rxjs/operators";
import { Site } from "src/services/encryptedDB";
import uuid from "uuid/v4";
import { database$ } from "../auth/auth";
import * as sync from "../sync/sync";
import { addDebugTag } from "rxjs-traces";

export const upsertSite = new Subject<Site>();

const databaseSite$ = database$.pipe(map((db) => keyBy(db.sites, "id")));

const siteUpdate$: Observable<Site | Site[]> = merge(
  upsertSite,
  defer(() => sync.uploadSuccess$).pipe(map((db) => db.sites))
);

const [, site$] = bind(
  databaseSite$.pipe(
    switchMap((site) =>
      siteUpdate$.pipe(
        scan(
          (acc, newSite) =>
            Array.isArray(newSite)
              ? keyBy(newSite, "id")
              : {
                  ...acc,
                  [newSite.id]: newSite,
                },
          site
        ),
        startWith(site)
      )
    ),
    addDebugTag("site$")
  )
);

export const [useSiteList, siteList$] = bind(
  site$.pipe(
    map((sites) => Object.values(sites).filter((site) => !site.deletedAt)),
    addDebugTag("siteList$")
  )
);

export const [, deletedSite$] = bind(
  site$.pipe(
    map((sites) => Object.values(sites).filter((site) => !!site.deletedAt)),
    addDebugTag("deletedSite$")
  )
);

export const [useSite] = bind((id: string) =>
  site$.pipe(
    map((sites) => sites[id]),
    addDebugTag("useSite")
  )
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
    ),
    addDebugTag("useFilteredSites")
  )
);

export const createSite = (): Site => ({
  id: uuid(),
  notesUpdtAt: new Date(),
  passwordUpdtAt: new Date(),
  updatedAt: new Date(),
  usernameUpdtAt: new Date(),
});
