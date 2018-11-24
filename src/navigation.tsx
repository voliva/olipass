import {
    createBottomTabNavigator,
    createStackNavigator,
    createSwitchNavigator,
    NavigationActions,
    NavigationContainerComponent,
    StackActions
} from 'react-navigation';
import { IconSets } from './components/iconSets';
import tabBarIcon from './components/tabBarIcon';
import { deferPromise } from './deferPromise';
import {
    LoginScreen,
    RegisterScreen,
    SecretListScreen,
    SiteListScreen,
    SplashScreen,
    SyncScreen
} from './screens';
import SecretFormScreen from './screens/SecretFormScreen';
import PasswordGeneratorScreen from './screens/PasswordGeneratorScreen';

export enum Screen {
    Splash = 'Splash',
    Register = 'Register',
    Login = 'Login',
    SecretList = 'SecretList',
    SiteList = 'SiteList',
    Sync = 'Sync',
    SiteForm = 'SiteForm',
    PasswordGenerator = 'PasswordGenerator'
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
    Main: createStackNavigator({
        Root: {
            screen: createBottomTabNavigator({
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
            navigationOptions: {
                title: 'OliPass'
            }
        },
        [Screen.SiteForm]: SecretFormScreen,
        [Screen.PasswordGenerator]: PasswordGeneratorScreen
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