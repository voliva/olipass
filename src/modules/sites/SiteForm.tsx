import { Field, FieldAttributes, Form, Formik } from "formik";
import { noop } from "lodash";
import React, { FC, MouseEvent, useEffect, useState } from "react";
import { Header, Panel, Popup } from "src/components/Page";
import { copyText } from "src/lib/copyText";
import { Site } from "src/services/encryptedDB";
import styled from "styled-components";
import { createSite, useSite, upsertSite } from "./sites";
import { Portal } from "react-portal";
import { PasswordGenerator } from "./PasswordGenerator";
import { useAction } from "src/lib/storeHelpers";

type FormikSite = Pick<
  Site,
  "name" | "website" | "username" | "password" | "notes"
>;

export const SiteForm: FC<{ siteId?: string; onBack?: () => void }> = ({
  siteId,
  onBack = noop,
}) => {
  const site = useSite(siteId || ""); // TODO
  const [displayPassword, setDisplayPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const dispatchUpsert = useAction(upsertSite);

  const handleSubmit = (values: FormikSite) => {
    const updatedSite = ((): Site => {
      if (!site) {
        return {
          ...createSite(),
          ...values,
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
          site.password !== values.password ? now : site.passwordUpdtAt,
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
      deletedAt: new Date(),
    });
    onBack();
  };

  useEffect(() => {
    if (site) {
      dispatchUpsert({
        ...site,
        lastVisitAt: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            notes: "",
          }
        }
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <SiteField type="text" label="Name" name="name" />
            <SiteField type="text" label="Website" name="website" />
            <SiteField type="text" label="Username" name="username" />
            <SiteField
              style={{ fontFamily: "Consolas, monaco, monospace" }}
              type={displayPassword ? "text" : "password"}
              label="Password"
              name="password"
            />
            <InputActions>
              <button type="button" onClick={() => copyText(values.password)}>
                Copy
              </button>
              <button type="button" onClick={() => setShowGenerator(true)}>
                Generate
              </button>
              <button
                type="button"
                onClick={() => setDisplayPassword((d) => !d)}
              >
                {displayPassword ? "Hide" : "Display"}
              </button>
            </InputActions>
            <SiteField as="textarea" label="Notes" name="notes" />
            <hr />
            <Actions>
              <button type="submit" disabled={!values.name && !values.name}>
                Save
              </button>
              {!!site && (
                <button type="button" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </Actions>
            {showGenerator && (
              <Portal>
                <Popup onClose={() => setShowGenerator(false)}>
                  <PasswordGenerator
                    onClose={() => setShowGenerator(false)}
                    onPassword={(password) => {
                      setShowGenerator(false);
                      setFieldValue("password", password);
                    }}
                  />
                </Popup>
              </Portal>
            )}
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
