import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducer";

interface Props {
    children: JSX.Element;
}

const store = createStore(reducer);

export default (props: Props) => <Provider store={store}>
    { props.children }
</Provider>