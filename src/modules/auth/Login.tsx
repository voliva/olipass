import {
  useAction,
  Action,
  ActionCreator,
  useReactObservable,
  filterAction
} from "@voliva/react-observable";
import { Field, Form, Formik } from "formik";
import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Header, Panel } from "src/components/Page";
import { getScreenRoutePath, Screen } from "src/router";
import { authError, authLogin } from "./auth";
import { take } from "rxjs/operators";
import styled, { keyframes, css } from "styled-components";
import { useAnimation, motion } from "framer-motion";

export const useDispatchedAction = <TAction extends Action>(
  actionCreator: ActionCreator<any, TAction>,
  handler?: (action: TAction) => void
): (() => Promise<TAction>) => {
  const { action$ } = useReactObservable();

  useEffect(() => {
    if (!handler) return;

    const subscription = action$
      .pipe(filterAction(actionCreator))
      .subscribe(handler);
    return () => subscription.unsubscribe();
  }, [actionCreator, handler]);

  return () => action$.pipe(take(1), filterAction(actionCreator)).toPromise();
};

export const Login = () => {
  const dispatchLogin = useAction(authLogin);
  const history = useHistory();
  const animation = useAnimation();
  const passwordRef = useRef<HTMLInputElement>(null);

  const waitForError = useDispatchedAction(authError, () => {
    animation.start({
      x: [-1, 2, -4, 4, -4, 2, -1, 0],
      transition: {
        duration: 0.4
      }
    });
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  });

  const reset = () => {
    history.push(getScreenRoutePath(Screen.Register));
  };

  return (
    <Panel>
      <Header>Login</Header>
      <Formik
        initialValues={{
          password: ""
        }}
        onSubmit={async ({ password }, { setSubmitting, setFieldValue }) => {
          const errorPromise = waitForError();
          dispatchLogin(password);
          await errorPromise;
          setFieldValue("password", "");
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Field
              type="password"
              name="password"
              placeholder="password"
              innerRef={passwordRef}
            />
            <hr />
            <Actions>
              <motion.button
                animate={animation}
                type="submit"
                disabled={values.password === "" || isSubmitting}
              >
                Log in
              </motion.button>
              <button onClick={reset}>Reset</button>
            </Actions>
          </Form>
        )}
      </Formik>
    </Panel>
  );
};

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Login;
