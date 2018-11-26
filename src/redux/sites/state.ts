import { Normalized, Timing, Unversioned, Versioned } from "../globals";

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

export interface SitesState {
    sites: Normalized<Site[]>,
    siteBeingEdited: Unversioned<Site> | null,
    passwordGenerated: string | null
}
