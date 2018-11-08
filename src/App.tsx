import React from 'react';
import Provider from './redux/provider';
import { MemoryRouter, Link, Route, Switch } from 'react-router-native';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => <Text style={styles.header}>Home</Text>;

const About = () => <Text style={styles.header}>About</Text>;

const Topics = () => <Text style={styles.header}>Topics</Text>;

const App = () => (
    <MemoryRouter>
        <View style={styles.container}>
            <View style={styles.nav}>
                <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
                    <Text>Home</Text>
                </Link>
                <Link to="/about" underlayColor="#f0f4f7" style={styles.navItem}>
                    <Text>About</Text>
                </Link>
                <Link to="/topics" underlayColor="#f0f4f7" style={styles.navItem}>
                    <Text>Topics</Text>
                </Link>
            </View>

            <Route path="/about" component={About} />
            <Route path="/" component={Topics} />
            <Route path="/" component={Home} />
        </View>
    </MemoryRouter>
)

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
