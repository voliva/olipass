import nthArg from "ramda/es/nthArg";
import { createSelector } from 'reselect';
import { ApplicationState } from "..";
import { unversion } from "../globals";

const getSitesState = (app: ApplicationState) => app.sites;

export const getAllSiteIds = createSelector(
    getSitesState,
    state => state.sites.allIds
);

export const getSiteBeingEdited = createSelector(
    getSitesState,
    state => state.siteBeingEdited
);

export const getLastPasswordGenerated = createSelector(
    getSitesState,
    state => state.passwordGenerated
);

const getAllSitesAndDeleted = createSelector(
    getSitesState, getAllSiteIds,
    (state, siteIds) => siteIds
        .map(id => state.sites.byId[id])
);

export const getAllSites = createSelector(
    getAllSitesAndDeleted,
    sites => sites.filter(site => !site.deletedAt)
);

export const getAllDeletedSites = createSelector(
    getAllSitesAndDeleted,
    sites => sites.filter(site => !!site.deletedAt)
);

export const getSiteById = createSelector(
    getSitesState,
    nthArg(1) as (_: ApplicationState, id: string) => string,
    (state, id: string) => state.sites.byId[id]
);

export const getUnversionedSiteById = createSelector(
    getSiteById,
    site => unversion(site)
);

export const editingSiteIsReadyToSave = createSelector(
    getSiteBeingEdited,
    state => state && !!(state.name.length + state.website.length) && !!state.password.length
);

export const editingSiteCanBeDeleted = createSelector(
    getSiteBeingEdited,
    getAllSiteIds,
    (siteBeingEdited, sites) => siteBeingEdited && sites.some(id => id === siteBeingEdited.id)
);
