import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import { getScreenRoutePath, Screen } from "./router";
import { Page } from "./components/Page";
import { initialize, authRedirect } from "./modules/auth/auth";
import { Subscribe } from "@react-rxjs/core";

initialize();

const Login = lazy(
  () => import(/* webpackPrefetch: true */ "./modules/auth/Login")
);
const Register = lazy(
  () => import(/* webpackPrefetch: true */ "./modules/auth/Register")
);
const Main = lazy(() => import(/* webpackPrefetch: true */ "./modules/Main"));

const App: React.FC = () => {
  return (
    <Page>
      <Subscribe source$={authRedirect} />
      <Routes>
        <Route path={getScreenRoutePath(Screen.Login)} element={<Login />} />
        <Route
          path={getScreenRoutePath(Screen.Register)}
          element={<Register />}
        />
        <Route path={getScreenRoutePath(Screen.Main)} element={<Main />} />
      </Routes>
    </Page>
  );
};

export default App;
