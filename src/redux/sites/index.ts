import combineDependantReducers from "combine-dependant-reducers";
import compose from "ramda/es/compose";
import rereducer, { payload } from 'rereducer';
import { createAction } from "../actions";
import { normalize, unversion, Unversioned, basicsHaveChanged } from "../globals";
import { SyncAction } from "../sync";
import { Site, SitesState, reversionSite } from "./state";
import { Options } from "generate-password-browser";

export enum SitesAction {
    SitePressed = 'SitePressed',
    CreateSitePressed = 'CreateSitePressed',
    NewSitePrepared = 'NewSitePrepared',
    SiteEdited = 'SiteEdited',
    PswGenOpened = 'PswGenOpened',
    RequestPswRegen = 'RequestPswRegen',
    PswRegenerated = 'PswRegenerated',
    GenPswAccepted = 'GenPswAccepted',
    SaveSitePressed = 'SaveSitePressed'
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

/// site
const normalizeSites = (sites: Site[]) => normalize(sites);

const normalizeSiteDB = compose(
    normalizeSites,
    payload('db', 'sites')
);

const upsertSite = (state: SitesState['sites'], {args}: { args: [SitesState['siteBeingEdited']] }) => {
    const newSite = args[0];
    if(!newSite) return state;
    const oldSite = state.byId[newSite.id];
    const now = new Date().getTime(); // Not very pure function.... damn

    const reversionedSite = reversionSite(newSite, now, oldSite);
    if(!oldSite || basicsHaveChanged(reversionedSite, oldSite)) {
        reversionedSite.updatedAt = now;
    }

    return {
        byId: {
            ...state.byId,
            [newSite.id]: reversionedSite
        },
        allIds: state.allIds.indexOf(newSite.id) >= 0 ? state.allIds : [
            ...state.allIds,
            newSite.id
        ]
    }
}

const sites = rereducer<SitesState['sites'], any>(
    {
        byId: {},
        allIds: []
    },
    [SyncAction.DBLoaded, normalizeSiteDB],
    [SitesAction.SaveSitePressed, upsertSite]
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
