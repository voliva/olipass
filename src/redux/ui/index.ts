import { createAction } from "redux-actions";

export enum UIAction {
    SitePressed = 'SitePressed',
    GeneratePswPressed = 'GeneratePswPressed'
}

export const sitePressed = createAction(UIAction.SitePressed, (site: any) => ({ site }));
export const generatePasswordPressed = createAction(UIAction.GeneratePswPressed, () => null);
