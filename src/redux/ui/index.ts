import { createAction } from "redux-actions";

export enum UIAction {
    SitePressed = 'SitePressed'
}

export const sitePressed = createAction(UIAction.SitePressed, (site: any) => ({ site }));
