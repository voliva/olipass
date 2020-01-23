import { FC, useState } from "react";
import { useSelector } from "@voliva/react-observable";
import { getSite } from "./sites";
import React from "react";
import { Panel, Header } from "src/components/Page";
import { Formik, Form, Field, FormikHelpers, FieldAttributes } from "formik";
import styled from "styled-components";
import { copyText } from "src/lib/copyText";
import { noop } from "lodash";

interface FormikSite {
  name?: string;
  website?: string;
  username?: string;
  password?: string;
  notes?: string;
}

export const SiteForm: FC<{ siteId?: string; onBack?: () => void }> = ({
  siteId,
  onBack = noop
}) => {
  const site = useSelector(getSite, { siteId });
  const [displayPassword, setDisplayPassword] = useState(false);

  const handleSubmit = (
    values: FormikSite,
    formikHelpers: FormikHelpers<FormikSite>
  ) => {};

  return (
    <Panel>
      <Header>
        Site
        <button style={{ float: "right" }} onClick={onBack}>
          x
        </button>
      </Header>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <SiteField type="text" label="Name" name="name" />
            <SiteField type="text" label="Website" name="website" />
            <SiteField type="text" label="Username" name="username" />
            <SiteField
              type={displayPassword ? "text" : "password"}
              label="Password"
              name="password"
            />
            <InputActions>
              <button onClick={() => copyText(values.password)}>Copy</button>
              <button disabled>Generate</button>
              <button onClick={() => setDisplayPassword(d => !d)}>
                {displayPassword ? "Hide" : "Display"}
              </button>
            </InputActions>
            <SiteField as="textarea" label="Notes" name="notes" />
            <hr />
            <Actions>
              <button type="submit" disabled={!values.name && !values.name}>
                Save
              </button>
              <button disabled>Delete</button>
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

const InputActions = styled.div`
  margin-top: -0.5em;
  margin-bottom: 0.5em;
`;

const SiteField: FC<{ label: string } & FieldAttributes<any>> = ({
  label,
  ...props
}) => {
  const { name } = props;
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Field id={name} {...props} />
    </>
  );
};
