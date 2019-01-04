import React from 'react';
import { NavigationContainerComponent, NavigationState, NavigationAction, NavigationContainerProps } from 'react-navigation';
import AppNavigator, { setTopLevelNavigator } from './navigation';
import { Provider } from './redux';
import { connect } from 'react-redux';

const handleNavigatorRef = (ref: NavigationContainerComponent) => setTopLevelNavigator(ref);

const App = connect(null,
    dispatch => ({
        handleNavigationStateChange: (
            prevNavigationState: NavigationState,
            nextNavigationState: NavigationState,
            action: NavigationAction
        ) => {
            (action as any).metadata = {
                ...(action as any).metadata,
                prevNavigationState,
                nextNavigationState
            };
            dispatch(action);
        }
    })
)
(({ handleNavigationStateChange }: { handleNavigationStateChange: NavigationContainerProps['onNavigationStateChange'] } ) => (
    <AppNavigator
        ref={handleNavigatorRef}
        onNavigationStateChange={handleNavigationStateChange} />)
);

export default class extends React.Component {
    componentDidMount() {
        // Font.loadAsync({
        //     'share-tech-mono': require('../assets/fonts/ShareTechMono-Regular.ttf'),
        // });
    }

    render = () => (
        <Provider>
            <App />
        </Provider>
    );
}
