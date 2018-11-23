import { takeEvery } from "redux-saga/effects";
import { UIAction, sitePressed } from "./index";
import { navigate, Screen } from "../../navigation";

function* whenSitePressed(action: ReturnType<typeof sitePressed>) {
    yield navigate(Screen.SiteForm, action.payload);
}

export default function* mySaga(): any {
    yield takeEvery(UIAction.SitePressed, whenSitePressed);
}
