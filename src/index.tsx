import "cryptojslib/rollups/aes";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import App from "./App";
import "./index.css";
import { Loading } from "./Loading";
import { history } from "./router";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router history={history}>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
