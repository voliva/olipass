import combineDependantReducers from "combine-dependant-reducers";
import { Options } from "generate-password-browser";
import always from "ramda/es/always";
import compose from "ramda/es/compose";
import nthArg from "ramda/es/nthArg";
import path from "ramda/es/path";
import { combineReducers } from "redux";
import rereducer, { payload, subReducer } from 'rereducer';
import { createAction } from "../actions";
import { basicsHaveChanged, normalize, unversion, Unversioned } from "../globals";
import { SyncAction } from "../sync";
import { reversionSite, Site, SitesState } from "./state";

export enum SitesAction {
    SitePressed = 'SitePressed',
    CreateSitePressed = 'CreateSitePressed',
    NewSitePrepared = 'NewSitePrepared',
    SiteEdited = 'SiteEdited',
    PswGenOpened = 'PswGenOpened',
    RequestPswRegen = 'RequestPswRegen',
    PswRegenerated = 'PswRegenerated',
    GenPswAccepted = 'GenPswAccepted',
    SaveSitePressed = 'SaveSitePressed',
    DeleteSite = 'DeleteSite'
}

export const sitePressed = (site: Site) => createAction(SitesAction.SitePressed, { site });
export const editSite = (site: Unversioned<Site>) => createAction(SitesAction.SiteEdited, { site });
export const generatePasswordPressed = () => createAction(SitesAction.PswGenOpened);
export const requestPasswordRegen = (options: Options) => createAction(SitesAction.RequestPswRegen, { options });
export const regeneratePassword = (psw: string) => createAction(SitesAction.PswRegenerated, { psw });
export const acceptGeneratedPassword = () => createAction(SitesAction.GenPswAccepted);
export const saveSitePressed = () => createAction(SitesAction.SaveSitePressed);
export const createSitePressed = () => createAction(SitesAction.CreateSitePressed);
export const sitePrepared = (site: Unversioned<Site>) => createAction(SitesAction.NewSitePrepared, { site });
export const deleteSite = (siteId: string) => createAction(SitesAction.DeleteSite, { siteId });

/// site
const excludeDeleted = (state: SitesState['sites']) => ({
    ...state,
    allIds: state.allIds.filter(id => !state.byId[id].deletedAt)
});

const normalizeSiteDB = compose(
    excludeDeleted,
    normalize,
    payload('db', 'sites')
);

const getSiteIdFromArgs = compose(
    path(['args', 0, 'id']),
    nthArg(1)
) as (...args:any[]) => string;

const upsertSite = (oldSite: Site, {args}: { args: [SitesState['siteBeingEdited']] }) => {
    const newSite = args[0];
    if(!newSite) return oldSite;
    const now = new Date().getTime(); // Not very pure function.... damn

    const reversionedSite = reversionSite(newSite, now, oldSite);
    if(!oldSite || basicsHaveChanged(reversionedSite, oldSite)) {
        reversionedSite.updatedAt = now;
    }

    return reversionedSite;
}

const upsertSiteInArray = (state: string[], {args}: { args: [SitesState['siteBeingEdited']] }) => {
    const newSite = args[0];
    if(!newSite) return state;

    return state.indexOf(newSite.id) >= 0 ? state : [
        ...state,
        newSite.id
    ];
}

const markSiteAsDeleted = (state: Site | null) => {
    if(!state) return state;

    const deletedAt = new Date().getTime();
    return {
        ...state,
        deletedAt,
        website: '',
        username: {
            updatedAt: deletedAt,
            value: ''
        },
        password: {
            updatedAt: deletedAt,
            value: ''
        },
        notes: {
            updatedAt: deletedAt,
            value: ''
        }
    };
}

const deleteSiteByIdInArray = (state: string[], { payload: { siteId } }: ReturnType<typeof deleteSite>) => {
    const index = state.indexOf(siteId);
    if(index < 0) return state;

    return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
    ];
}

const byId = rereducer<SitesState['sites']['byId'], any>(
    {},
    [SitesAction.SaveSitePressed, subReducer(getSiteIdFromArgs, upsertSite)],
    [SitesAction.DeleteSite, subReducer(payload('siteId'), markSiteAsDeleted)]
);

const allIds = rereducer<string[], any>(
    [],
    [SitesAction.SaveSitePressed, upsertSiteInArray],
    [SitesAction.DeleteSite, deleteSiteByIdInArray]
);

const sites = rereducer<SitesState['sites'], any>(
    {
        byId: {},
        allIds: []
    },
    [SyncAction.DBLoaded, normalizeSiteDB],
    [always(true), combineReducers({
        byId,
        allIds
    })]
);

/// siteBeingEdited
const unversionSite = compose(
    unversion as (obj: Site) => Unversioned<Site>,
    payload('site')
);

const updateSitePassword = (
    siteBeingEdited: SitesState['siteBeingEdited'],
    {args}: { args: [SitesState['passwordGenerated']] }
): SitesState['siteBeingEdited'] => (siteBeingEdited && args[0]) ? ({
    ...siteBeingEdited,
    password: args[0]
}) : siteBeingEdited;

const siteBeingEdited = rereducer<SitesState['siteBeingEdited'], any>(
    null,
    [SitesAction.NewSitePrepared, payload('site')],
    [SitesAction.SitePressed, unversionSite],
    [SitesAction.SiteEdited, payload('site')],
    [SitesAction.GenPswAccepted, updateSitePassword]
)

/// passwordGenerated
const passwordGenerated = rereducer<SitesState['passwordGenerated'], any>(
    null,
    [SitesAction.PswRegenerated, payload('psw')]
)

const reducer = combineDependantReducers({
    sites: [sites, '@prev siteBeingEdited'],
    siteBeingEdited: [siteBeingEdited, '@prev passwordGenerated'],
    passwordGenerated
});

export default reducer;
