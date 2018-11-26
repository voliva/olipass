import combineDependantReducers from "combine-dependant-reducers";
import compose from "ramda/es/compose";
import rereducer, { payload } from 'rereducer';
import { createAction } from "../actions";
import { normalize, unversion, Unversioned } from "../globals";
import { SyncAction } from "../sync";
import { Site, SitesState } from "./state";
import { Options } from "generate-password-browser";

export enum SitesAction {
    SitePressed = 'SitePressed',
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

/// site
const normalizeSites = (sites: Site[]) => normalize(sites);

const normalizeSiteDB = compose(
    normalizeSites,
    payload('db', 'sites')
);

const sites = rereducer<SitesState['sites'], any>(
    {
        byId: {},
        allIds: []
    },
    [SyncAction.DBLoaded, normalizeSiteDB]
);

/// siteBeingEdited
const unversionSite = compose(
    unversion as (obj: Site) => Unversioned<Site>,
    payload('site')
);

const updateSitePassword = (
    siteBeingEdited: SitesState['siteBeingEdited'],
    {args}:any
): SitesState['siteBeingEdited'] => (siteBeingEdited && args[0]) ? ({
    ...siteBeingEdited,
    password: args[0]
}) : siteBeingEdited;

const siteBeingEdited = rereducer<SitesState['siteBeingEdited'], any>(
    null,
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
    sites,
    siteBeingEdited: [siteBeingEdited, '@next passwordGenerated'],
    passwordGenerated
});

export default reducer;
