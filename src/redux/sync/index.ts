import { createAction } from "../actions";
import { PasswordDB } from "./state";
import rereducer from "rereducer";
import { combineReducers } from "redux";
import { always } from "ramda";

export enum SyncAction {
    DBLoaded = 'DBLoaded',
    ExportPressed = 'ExportPressed',
    ImportPressed = 'ImportPressed',
    ImportNeedsPsw = 'ImportNeedsPsw',
    ImportPswSubmitted = 'ImportPswSubmitted'
}

export const dbLoaded = (db: PasswordDB | null, password: string) => createAction(SyncAction.DBLoaded, {db, password});
export const exportPressed = () => createAction(SyncAction.ExportPressed);
export const importPressed = () => createAction(SyncAction.ImportPressed);
export const importNeedsPsw = () => createAction(SyncAction.ImportNeedsPsw);
export const importPswSubmitted = (password: string) => createAction(SyncAction.ImportPswSubmitted, { password });

const promptImportPsw = rereducer(
    false,
    [SyncAction.ImportNeedsPsw, always(true)],
    [SyncAction.ImportPswSubmitted, always(false)]
);

const reducer = combineReducers({
    promptImportPsw
});

export default reducer;
