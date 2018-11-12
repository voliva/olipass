import { Action } from "redux";

enum AppScreen {
    Splash,
    Register,
    Login,
    SecretList,
    SiteList,
    Sync
};

const HomeScreens = [
    AppScreen.SecretList,
    AppScreen.SiteList,
    AppScreen.Sync
];

enum AppModals {
    SecretForm,
    SiteForm,
    PswGen
}

interface NavigationState {
    screen: AppScreen;
    modals: AppModals[];
}

const defaultNavigationState: NavigationState = {
    screen: AppScreen.Splash,
    modals: []
}

const reducer = (state: NavigationState, action: Action) => state || defaultNavigationState;

export default reducer;
export { HomeScreens }