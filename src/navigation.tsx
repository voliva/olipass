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
        [Screen.SiteList]: SiteListScreen,
        [Screen.SecretList]: SecretListScreen,
        [Screen.Sync]: SyncScreen,
    }),
}, {
    initialRouteName: Screen.Splash
});

// mainNavigator.navigationOptions = {
//     tabBarLabel: 'Home',
//     tabBarIcon: (({ focused }) => (
//         <TabBarIcon
//         focused={focused}
//         name={
//             Platform.OS === 'ios'
//             ? `ios-information-circle${focused ? '' : '-outline'}`
//             : 'md-information-circle'
//         }
//         />
//     )) as NavigationTabScreenOptions['tabBarIcon'],
// };

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