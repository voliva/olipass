import {
  createStore,
  switchAction,
  createSelector,
  createTypedPropSelector
} from "@voliva/react-observable";
import { authSuccess } from "../auth/auth";
import { Site } from "src/services/encryptedDB";
import { keyBy } from "lodash";

export const [getSites, siteStore] = createStore<Record<string, Site>>(
  {},
  (state, action) =>
    switchAction(
      action,
      type => [
        type(authSuccess, ({ payload }) => keyBy(payload.database.sites, "id"))
      ],
      state
    )
);

const siteIdPropSelector = createTypedPropSelector("siteId")<
  string | undefined
>();
export const getSite = createSelector(
  [getSites, siteIdPropSelector],
  (sites, id) => (id ? sites[id] : undefined)
);
