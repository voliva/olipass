import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore, Action } from "redux";
import createSagaMiddleware from 'redux-saga';
import reducer from "./reducer";
import rootSaga from './saga';
import { Store } from "redux";

interface Props {
    children: JSX.Element;
}

const loggingMiddleware = (store: Store) => (next: (action: Action) => any) => (action: Action) => {
    console.log('Dispatching action', action.type);
    const result = next(action);
    return result;
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware, loggingMiddleware)
);
sagaMiddleware.run(rootSaga);

export default (props: Props) => <Provider store={store}>
    { props.children }
</Provider>