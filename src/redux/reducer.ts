import { combineReducers } from 'redux';
import auth from './auth';
import sites from './sites';
import sync from './sync';

export default combineReducers({
    auth,
    sites,
    sync
});
