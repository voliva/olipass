import React, { ComponentType } from 'react';
import Provider from './redux/provider';
import { View, Text, StyleSheet } from 'react-native';
import { ApplicationState } from './redux';
import { connect } from 'react-redux';
import compose from 'ramda/es/compose';
import { branch, renderNothing } from 'recompose';

const Home = () => <Text style={styles.header}>Home</Text>;

const About = () => <Text style={styles.header}>About</Text>;

const Topics = () => <Text style={styles.header}>Topics</Text>;

// compose<V0, T1, T2>(fn1: (x: T1) => T2, fn0: (x0: V0) => T1): (x0: V0) => T2;

const hide = Symbol('hide');
const renderIfSelector = <T extends any>(selector: (state: ApplicationState) => boolean) => compose<
    ComponentType<T>,
    ComponentType<T & { shouldDisplay: boolean }>,
    ComponentType<T>
>(
    connect(state => ({
        [hide]: selector(state)
    })),
    branch(props => props[hide], renderNothing)
);

const RoutedHome = renderIfSelector(
    state => true
)(Home);
const RoutedAbout = renderIfSelector(
    state => true
)(About);
const RoutedTopics = renderIfSelector(
    state => true
)(Topics);

const App = () => (<View style={styles.container}>
    <View style={styles.nav}>
        <View style={styles.navItem}>
            <Text>Home</Text>
        </View>
        <View style={styles.navItem}>
            <Text>About</Text>
        </View>
        <View style={styles.navItem}>
            <Text>Topics</Text>
        </View>
    </View>

    <RoutedHome />
    <RoutedAbout />
    <RoutedTopics />
</View>)

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    fontSize: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  }
});

export default () => (
    <Provider>
        <App />
    </Provider>
);
