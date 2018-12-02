import {AppRegistry} from 'react-native';
import './shim.js'
import 'core-js/es6';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
