import { createStore, switchAction } from "@voliva/react-observable";
import { authSuccess } from "../auth/auth";
import { Site } from "src/services/encryptedDB";

export const [getSites, siteStore] = createStore<Site[]>([], (state, action) => switchAction(action, type => [
    type(authSuccess, ({ payload }) => payload.database.sites)
], state));
