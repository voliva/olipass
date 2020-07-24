import { database$ } from "../auth/auth";
import { Site } from "src/services/encryptedDB";
import { keyBy } from "lodash";
import uuid from "uuid/v4";
import { Subject } from "rxjs";
import { map, switchMap, scan } from "rxjs/operators";
import { bind } from "@react-rxjs/core";

export const upsertSite = new Subject<Site>();

const databaseSite$ = database$.pipe(map((db) => keyBy(db.sites, "id")));

const [, site$] = bind(
  databaseSite$.pipe(
    switchMap((site) =>
      upsertSite.pipe(
        scan(
          (acc, newSite) => ({
            ...acc,
            [newSite.id]: newSite,
          }),
          site
        )
      )
    )
  )
);

// type(uploadSuccess, ({ payload }) =>
//   payload.sites.reduce(
//     (acc, site) => ({
//       ...acc,
//       [site.id]: site,
//     }),
//     {}
//   )
// ),

export const [useSiteList, siteList$] = bind(
  site$.pipe(
    map((sites) => Object.values(sites).filter((site) => !site.deletedAt))
  )
);

export const [, deletedSite$] = bind(
  site$.pipe(
    map((sites) => Object.values(sites).filter((site) => !!site.deletedAt))
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
