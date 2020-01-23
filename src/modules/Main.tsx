import React from "react";
import { IoMdAdd, IoMdCloudUpload, IoMdDownload } from "react-icons/io";
import { Panel } from "src/components/Page";
import styled from "styled-components";
import { SiteForm } from "./sites/SiteForm";
import { SiteList } from "./sites/SiteList";

export const Main = () => {
  return (
    <>
      <SiteForm />
      <Panel>
        <SiteList />
        <Actions>
          <Action>
            <IoMdAdd />
          </Action>
          <Action disabled>
            <IoMdCloudUpload />
          </Action>
          <Action disabled>
            <IoMdDownload />
          </Action>
        </Actions>
      </Panel>
    </>
  );
};
export default Main;

const Actions = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Action = styled.button`
  font-size: 2em;

  svg {
    vertical-align: middle;
  }
`;
