import React from 'react';
import { NavigationContainerComponent } from 'react-navigation';
import AppNavigator, { setTopLevelNavigator } from './navigation';
import { Provider } from './redux';

const handleNavigatorRef = (ref: NavigationContainerComponent) => setTopLevelNavigator(ref);
const App = () => (<AppNavigator ref={handleNavigatorRef} />)

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
