import { takeEvery } from "redux-saga/effects";
import { UIAction, sitePressed } from "./index";
import { navigate, Screen } from "../../navigation";
import { Action } from "redux";

function* whenSitePressed(action: ReturnType<typeof sitePressed>) {
    yield navigate(Screen.SiteForm, action.payload);
}

function* whenGeneratePasswordPressed(action: Action) {
    yield navigate(Screen.PasswordGenerator);
}

export default function* mySaga(): any {
    yield takeEvery(UIAction.SitePressed, whenSitePressed);
    yield takeEvery(UIAction.GeneratePswPressed, whenGeneratePasswordPressed);
}
