import { useAction, useDispatchedAction } from "@voliva/react-observable";
import { Field, Form, Formik } from "formik";
import { motion, useAnimation } from "framer-motion";
import React, { useRef } from "react";
import { useHistory } from "react-router";
import { Header, Panel } from "src/components/Page";
import { getScreenRoutePath, Screen } from "src/router";
import styled from "styled-components";
import { authError, authLogin } from "./auth";

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

  const reset = async () => {
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
