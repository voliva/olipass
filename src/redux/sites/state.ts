import { Normalized, Timing, Unversioned, Versioned, createReversion } from "../globals";

export interface Site extends Timing {
    id: string;
    name: string;
    website: string;
    username: Versioned<string>;
    password: Versioned<string>;
    // tags: string[];
    notes: Versioned<string>;
    // secrets: Secret[];
}

export const reversionSite = createReversion({} as Unversioned<Site>, 'username', 'password', 'notes');

export interface SitesState {
    sites: Normalized<Site[]>,
    siteBeingEdited: Unversioned<Site> | null,
    passwordGenerated: string | null
}
