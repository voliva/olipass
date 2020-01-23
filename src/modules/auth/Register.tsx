import { useAction } from "@voliva/react-observable";
import React from "react";
import { useInputState } from "src/lib/useInputState";
import { authCreate } from "./auth";
import { Panel, Header } from "src/components/Page";
import { hasDatabase } from "src/services/encryptedDB";

export const Register = () => {
  const [password, handlePasswordChange] = useInputState("");
  const [confirm, handleConfirmChange] = useInputState("");
  const dispatchCreate = useAction(authCreate);

  const handleCreate = () => {
    if (
      hasDatabase() &&
      !window.confirm(
        "This will delete your previous password list, you really want to proceed?"
      )
    ) {
      return;
    }
    dispatchCreate(password);
  };

  return (
    <Panel>
      <Header>Register</Header>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="password"
      />
      <input
        type="password"
        value={confirm}
        onChange={handleConfirmChange}
        placeholder="confirm password"
      />
      <hr />
      <button
        onClick={handleCreate}
        disabled={password === "" || password !== confirm}
      >
        Create
      </button>
    </Panel>
  );
};
export default Register;
