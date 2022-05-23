import { Field, Form, Formik, useFormikContext } from "formik";
import { motion, useAnimation } from "framer-motion";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import { Header, Panel } from "src/components/Page";
import { getScreenRoutePath, Screen } from "src/router";
import styled from "styled-components";
import { error$, authLogin } from "./auth";
import { useAction, useObservableEffect } from "src/lib/storeHelpers";

export const Login = () => {
  const dispatchLogin = useAction(authLogin);

  return (
    <Panel>
      <Header>Login</Header>
      <Formik
        initialValues={{
          password: "",
        }}
        onSubmit={({ password }) => dispatchLogin(password)}
      >
        <LoginForm />
      </Formik>
    </Panel>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const animation = useAnimation();
  const passwordRef = useRef<HTMLInputElement>(null);
  const { isSubmitting, values, setSubmitting, setFieldValue } =
    useFormikContext<{ password: string }>();

  useObservableEffect(error$, () => {
    animation.start({
      x: [-1, 2, -4, 4, -4, 2, -1, 0],
      transition: {
        duration: 0.4,
      },
    });
    setSubmitting(false);
    setFieldValue("password", "");
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  });

  const reset = async () => {
    navigate(getScreenRoutePath(Screen.Register));
  };

  return (
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
  );
};

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Login;
