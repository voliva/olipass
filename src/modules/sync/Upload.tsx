import { Field, FieldProps, Form, Formik, useFormikContext } from "formik";
import { noop } from "lodash";
import React, { ChangeEvent, FC } from "react";
import { Header, Panel } from "src/components/Page";
import { uploadFile, uploadError$, loadedDB$ } from "./sync";
import { useAnimation, motion } from "framer-motion";
import { useAction, useObservableEffect } from "src/lib/storeHelpers";

interface FormikState {
  password: string;
  file: File;
}

const initialState: FormikState = {
  password: "",
  file: null as any,
};

export const Upload: FC<{ onBack?: () => void }> = ({ onBack = noop }) => {
  const dispatchUpload = useAction(uploadFile);
  useObservableEffect(loadedDB$, onBack);

  return (
    <Panel>
      <Header>
        Import
        <button type="button" style={{ float: "right" }} onClick={onBack}>
          x
        </button>
      </Header>
      <Formik initialValues={initialState} onSubmit={dispatchUpload}>
        <UploadForm />
      </Formik>
    </Panel>
  );
};

const UploadForm = () => {
  const { values } = useFormikContext<any>();
  const animation = useAnimation();

  useObservableEffect(uploadError$, () => {
    animation.start({
      x: [-1, 2, -4, 4, -4, 2, -1, 0],
      transition: {
        duration: 0.4,
      },
    });
  });

  return (
    <Form>
      <Field name="file" component={FileUpload} />
      <Field name="password" type="password" placeholder="password" />
      <hr />
      <motion.button animate={animation} type="submit" disabled={!values.file}>
        Import
      </motion.button>
    </Form>
  );
};

function FileUpload(props: FieldProps) {
  const { field, form } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    form.setFieldValue(field.name, file);
  };

  return <input type="file" onChange={handleChange} className="form-control" />;
}
