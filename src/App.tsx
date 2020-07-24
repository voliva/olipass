import React, { lazy } from "react";
import { Route, Switch } from "react-router";
import { getScreenRoutePath, Screen } from "./router";
import { Page } from "./components/Page";
import { initialize, authRedirect } from "./modules/auth/auth";
import { Subscribe } from "@react-rxjs/utils";

initialize();

const App: React.FC = () => {
  return (
    <Page>
      <Subscribe source$={authRedirect} />
      <Switch>
        <Route
          path={getScreenRoutePath(Screen.Login)}
          component={lazy(() =>
            import(/* webpackPrefetch: true */ "./modules/auth/Login")
          )}
        />
        <Route
          path={getScreenRoutePath(Screen.Register)}
          component={lazy(() =>
            import(/* webpackPrefetch: true */ "./modules/auth/Register")
          )}
        />
        <Route
          path={getScreenRoutePath(Screen.Main)}
          component={lazy(() =>
            import(/* webpackPrefetch: true */ "./modules/Main")
          )}
        />
      </Switch>
    </Page>
  );
};

export default App;
