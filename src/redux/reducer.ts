import { combineReducers } from 'redux';
import auth from './auth';
import sites from './sites';

export default combineReducers({
    auth,
    sites,
});
