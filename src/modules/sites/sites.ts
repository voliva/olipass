import {
  createStore,
  switchAction,
  createSelector,
  createTypedPropSelector,
  createStandardAction
} from "@voliva/react-observable";
import { authSuccess } from "../auth/auth";
import { Site } from "src/services/encryptedDB";
import { keyBy } from "lodash";
import uuid from "uuid/v4";

export const upsertSite = createStandardAction<Site>("upsert site");

export const [getSites, siteStore] = createStore<Record<string, Site>>(
  {},
  (state, action) =>
    switchAction(
      action,
      type => [
        type(authSuccess, ({ payload }) => keyBy(payload.database.sites, "id")),
        type(upsertSite, ({ payload }) => ({
          ...state,
          [payload.id]: payload
        }))
      ],
      state
    )
);

export const getSiteList = createSelector([getSites], sites =>
  Object.values(sites).filter(site => !site.deletedAt)
);

export const getDeletedSites = createSelector([getSites], sites =>
  Object.values(sites).filter(site => !!site.deletedAt)
);

const siteIdPropSelector = createTypedPropSelector("siteId")<
  string | undefined
>();
export const getSite = createSelector(
  [getSites, siteIdPropSelector],
  (sites, id) => (id ? sites[id] : undefined)
);

const filterPropSelector = createTypedPropSelector("filter")<
  string | undefined
>();
const localeIncludes = (base: string | undefined, substr: string) =>
  base && base.toLowerCase().includes(substr.toLowerCase());
export const getFilteredSiteList = createSelector(
  [getSiteList, filterPropSelector],
  (sites, filter) =>
    filter
      ? sites.filter(
          ({ name, website, username, notes }) =>
            localeIncludes(name, filter) ||
            localeIncludes(website, filter) ||
            localeIncludes(username, filter) ||
            localeIncludes(notes, filter)
        )
      : sites
);

export const createSite = (): Site => ({
  id: uuid(),
  notesUpdtAt: new Date(),
  passwordUpdtAt: new Date(),
  updatedAt: new Date(),
  usernameUpdtAt: new Date()
});
