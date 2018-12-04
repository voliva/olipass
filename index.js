import {AppRegistry} from 'react-native';
import App from './build/App';
import {name as appName} from './app.json';
import 'cryptojslib/rollups/aes';

AppRegistry.registerComponent(appName, () => App);
