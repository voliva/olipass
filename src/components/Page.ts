import styled from "styled-components";
import { useRef, createElement, MouseEvent } from "react";
import { noop } from "lodash";

const pageBackground = "#f8f8f8";
const headerBackground = "#f0f0f0";
const panelPadding = "1em";

export const Page = styled.div`
  background-color: ${pageBackground};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const Panel = styled.div`
  padding: ${panelPadding};
  background-color: ${pageBackground};
  overflow: hidden;

  @media (min-width: 30em) {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.75);
    width: 25em;
    margin: auto;
    margin-top: 4em;
  }
`;

const StyledPopup = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);

  ${Panel} {
    @media (min-width: 30em) {
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.75);
      width: 20em;
      margin-top: 8em;
    }
  }
`;
export const Popup: FCC<{ onClose?: () => void }> = ({
  onClose = noop,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (evt: MouseEvent) => {
    if (evt.target === ref.current) {
      onClose();
    }
  };

  return createElement(
    StyledPopup,
    {
      ref,
      onClick: handleClick,
    },
    children
  );
};

export const Header = styled.div`
  background-color: ${headerBackground};
  margin: -${panelPadding} -${panelPadding} ${panelPadding} -${panelPadding};
  padding: 0.5em 1em;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.75);
`;
