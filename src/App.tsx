import React, { lazy } from "react";
import { Route, Switch } from "react-router";
import { getScreenRoutePath, Screen } from "./router";
import { Page } from "./components/Page";

const App: React.FC = () => {
  return (
    <Page>
      <Switch>
        <Route
          path={getScreenRoutePath(Screen.Login)}
          component={lazy(() => import("./modules/auth/Login"))}
        />
        <Route
          path={getScreenRoutePath(Screen.Register)}
          component={lazy(() => import("./modules/auth/Register"))}
        />
        <Route
          path={getScreenRoutePath(Screen.Main)}
          component={lazy(() => import("./modules/Main"))}
        />
      </Switch>
    </Page>
  );
};

export default App;
