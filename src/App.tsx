import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { NavigationContainerComponent } from 'react-navigation';
import AppNavigator, { setTopLevelNavigator } from './navigation';
import { Provider } from './redux';

const handleNavigatorRef = (ref: NavigationContainerComponent) => setTopLevelNavigator(ref);
const App = () => (<AppNavigator ref={handleNavigatorRef} />)

export default () => (
    <Provider>
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <App />
        </KeyboardAvoidingView>
    </Provider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});