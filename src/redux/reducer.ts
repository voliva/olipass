import { combineReducers } from 'redux';
import auth from './auth';
import passwords from './passwords';

export default combineReducers({
    auth,
    passwords,
});
