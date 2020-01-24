import { FC, useState, MouseEvent } from "react";
import { useSelector, useAction } from "@voliva/react-observable";
import { getSite, createSite, upsertSite } from "./sites";
import React from "react";
import { Panel, Header } from "src/components/Page";
import { Formik, Form, Field, FormikHelpers, FieldAttributes } from "formik";
import styled from "styled-components";
import { copyText } from "src/lib/copyText";
import { noop } from "lodash";
import { Site } from "src/services/encryptedDB";

type FormikSite = Pick<
  Site,
  "name" | "website" | "username" | "password" | "notes"
>;

export const SiteForm: FC<{ siteId?: string; onBack?: () => void }> = ({
  siteId,
  onBack = noop
}) => {
  const site = useSelector(getSite, { siteId });
  const [displayPassword, setDisplayPassword] = useState(false);
  const dispatchUpsert = useAction(upsertSite);

  const handleSubmit = (values: FormikSite) => {
    const updatedSite = ((): Site => {
      if (!site) {
        return {
          ...createSite(),
          ...values
        };
      }
      const now = new Date();
      return {
        ...site,
        ...values,
        updatedAt: now,
        notesUpdtAt: site.notes !== values.notes ? now : site.notesUpdtAt,
        usernameUpdtAt:
          site.username !== values.username ? now : site.usernameUpdtAt,
        passwordUpdtAt:
          site.password !== values.password ? now : site.passwordUpdtAt
      };
    })();
    dispatchUpsert(updatedSite);
    onBack();
  };

  const handleDelete = (evt: MouseEvent) => {
    evt.preventDefault();
    if (!window.confirm("Are you sure you want to delete this site?")) {
      return;
    }
    dispatchUpsert({
      ...site!,
      deletedAt: new Date()
    });
    onBack();
  };

  return (
    <Panel>
      <Header>
        Site
        <button style={{ float: "right" }} onClick={onBack}>
          x
        </button>
      </Header>
      <Formik
        initialValues={
          site || {
            name: "",
            website: "",
            username: "",
            password: "",
            notes: ""
          }
        }
        onSubmit={handleSubmit}
      >
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
              {!!site && <button onClick={handleDelete}>Delete</button>}
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
      <Field id={name} autoComplete="off" {...props} />
    </>
  );
};
