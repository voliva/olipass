import "cryptojslib/rollups/aes";
import React, { Suspense, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "react-router";
import App from "./App";
import "./index.css";
import { Loading } from "./Loading";
import { history } from "./router";
import * as serviceWorker from "./serviceWorker";

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

const root = createRoot(document.getElementById("root")!);
root.render(
  <AppRouter>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </AppRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
