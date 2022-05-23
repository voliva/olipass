import { generate } from "generate-password-browser";
import { noop } from "lodash";
import React, { FC, useMemo, useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Switch, { ReactSwitchProps } from "react-switch";
import { Header, Panel } from "src/components/Page";
import styled from "styled-components";

export const PasswordGenerator: FC<{
  onClose?: () => void;
  onPassword?: (psw: string) => void;
}> = ({ onClose, onPassword = noop }) => {
  const [length, setLength] = useState(8);
  const [uppercase, setUppercase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const password = useMemo(
    () =>
      generate({
        length,
        numbers,
        symbols,
        uppercase,
        strict: true,
      }),
    [length, uppercase, numbers, symbols]
  );

  return (
    <Panel>
      <Header>
        Generate
        <button style={{ float: "right" }} onClick={onClose}>
          x
        </button>
      </Header>
      <Password>{password}</Password>
      <RangeWrapper>
        <InputRange
          onChange={setLength as any}
          value={length}
          step={1}
          minValue={4}
          maxValue={20}
        />
      </RangeWrapper>
      <SwitchField
        label="Uppercase"
        checked={uppercase}
        onChange={setUppercase}
      />
      <SwitchField label="Numbers" checked={numbers} onChange={setNumbers} />
      <SwitchField label="Symbols" checked={symbols} onChange={setSymbols} />
      <hr />

      <button type="button" onClick={() => onPassword(password)}>
        OK
      </button>
    </Panel>
  );
};

const SwitchField: FC<ReactSwitchProps & { label: string }> = ({
  label,
  ...props
}) => {
  return (
    <StyledSwitchField>
      <label>{label}</label>
      <Switch {...props} />
    </StyledSwitchField>
  );
};

const Password = styled.div`
  font-family: Consolas, monaco, monospace;
`;

const RangeWrapper = styled.div`
  * {
    transition: none !important;
  }

  padding: 0.5em 0;
  padding-top: 1em;

  .input-range__label--min,
  .input-range__label--max {
    display: none;
  }
`;

const StyledSwitchField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: thin solid lightgray;
  padding: 0.5em 0;
`;
