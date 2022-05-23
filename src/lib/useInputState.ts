import { useState, ChangeEvent } from "react";

export const useInputState = (defaultValue?: string) => {
  const [state, setState] = useState(defaultValue || "");

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setState(evt.target.value);

  return [state, handleInputChange, setState] as [
    typeof state,
    typeof handleInputChange,
    typeof setState
  ];
};
