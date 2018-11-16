import {
    createStackNavigator,
    createSwitchNavigator,
    NavigationActions,
    NavigationContainerComponent,
    StackActions,
    createBottomTabNavigator
} from 'react-navigation';
import { deferPromise } from './deferPromise';
import { LoginScreen,
    RegisterScreen,
    SiteListScreen,
    SplashScreen,
    SecretListScreen,
    SyncScreen
} from './screens';
import tabBarIcon from './components/tabBarIcon';
import { IconSets } from './components/iconSets';

export enum Screen {
    Splash = 'Splash',
    Register = 'Register',
    Login = 'Login',
    SecretList = 'SecretList',
    SiteList = 'SiteList',
    Sync = 'Sync'
}

export default createSwitchNavigator({
    [Screen.Splash]: SplashScreen,
    Auth: createStackNavigator({
        [Screen.Login]: {
            screen: LoginScreen,
            navigationOptions: {
                title: 'Login'
            }
        },
        [Screen.Register]: {
            screen: RegisterScreen,
            navigationOptions: {
                title: 'Create new'
            }
        }
    }),
    Main: createBottomTabNavigator({
        [Screen.SiteList]: {
            screen: SiteListScreen,
            navigationOptions: {
                title: 'Sites',
                tabBarIcon: tabBarIcon(IconSets.Web)
            }
        },
        [Screen.SecretList]: {
            screen: SecretListScreen,
            navigationOptions: {
                title: 'Secrets',
                tabBarIcon: tabBarIcon(IconSets.Notes)
            }
        },
        [Screen.Sync]: {
            screen: SyncScreen,
            navigationOptions: {
                title: 'Sync',
                tabBarIcon: tabBarIcon(IconSets.Sync)
            }
        },
    }),
}, {
    initialRouteName: Screen.Splash
});

let deferredNavigator = deferPromise<NavigationContainerComponent>();

export function setTopLevelNavigator(navigatorRef: NavigationContainerComponent) {
    if(deferredNavigator.resolved) {
        deferredNavigator = deferPromise();
    }
    deferredNavigator.resolve(navigatorRef);
}

export async function navigate(screen: Screen, params?: any) {
    const navigator = await deferredNavigator.promise;
    return navigator.dispatch(
        NavigationActions.navigate({
            routeName: screen,
            params,
        })
    );
}


export async function navigateReplace(screen: Screen, params?: any) {
    const navigator = await deferredNavigator.promise;
    return navigator.dispatch(
        StackActions.replace({
            routeName: screen,
            params,
        })
    );
}