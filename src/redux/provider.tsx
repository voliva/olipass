import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from 'redux-saga';
import reducer from "./reducer";
import rootSaga from './saga';

interface Props {
    children: JSX.Element;
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default (props: Props) => <Provider store={store}>
    { props.children }
</Provider>