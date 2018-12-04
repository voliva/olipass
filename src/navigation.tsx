import {
    createBottomTabNavigator,
    createStackNavigator,
    createSwitchNavigator,
    NavigationActions,
    NavigationContainerComponent,
    StackActions
} from 'react-navigation';
import tabBarIcon from './components/tabBarIcon';
import { deferPromise } from './deferPromise';
import {
    LoginScreen,
    RegisterScreen,
    SecretListScreen,
    SiteListScreen,
    SplashScreen,
    SyncScreen,
    SiteFormScreen
} from './screens';
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
                        tabBarIcon: tabBarIcon('globe')
                    }
                },
                [Screen.SecretList]: {
                    screen: SecretListScreen,
                    navigationOptions: {
                        title: 'Secrets',
                        tabBarIcon: tabBarIcon('document')
                    }
                },
                [Screen.Sync]: {
                    screen: SyncScreen,
                    navigationOptions: {
                        title: 'Sync',
                        tabBarIcon: tabBarIcon('sync')
                    }
                },
            }),
            navigationOptions: {
                title: 'OliPass'
            }
        },
        [Screen.SiteForm]: SiteFormScreen,
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

export async function back() {
    const navigator = await deferredNavigator.promise;
    return navigator.dispatch(
        NavigationActions.back()
    )
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