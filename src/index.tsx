import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "@voliva/react-observable";
import { Router } from "react-router";
import { authStore } from "./modules/auth/auth";
import { history } from "./router";
import "cryptojslib/rollups/aes";
import { Loading } from "./Loading";
import { siteStore } from "./modules/sites/sites";

ReactDOM.render(
  <Provider stores={[authStore, siteStore]}>
    <Router history={history}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
