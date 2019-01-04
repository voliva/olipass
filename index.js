import '@babel/polyfill';
import './shim.js';
import {AppRegistry} from 'react-native';
import App from './build/App';
import {name as appName} from './app.json';
import 'cryptojslib/rollups/aes';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Remote debugger is in a background tab which may cause apps to perform slowly',
  'Realm file decryption failed'
]);

AppRegistry.registerComponent(appName, () => App);
