import "cryptojslib/rollups/aes";
import React, { Suspense, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import "./index.css";
import { Loading } from "./Loading";
import { history } from "./router";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

const AppRouter: FCC = ({ children }) => {
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), []);

  return (
    <Router
      navigator={history}
      location={state.location}
      navigationType={state.action}
    >
      {children}
    </Router>
  );
};

ReactDOM.render(
  <AppRouter>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </AppRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
