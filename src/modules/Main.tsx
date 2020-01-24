import React, { useState } from "react";
import { IoMdAdd, IoMdCloudUpload, IoMdDownload } from "react-icons/io";
import { Panel, Popup } from "src/components/Page";
import styled from "styled-components";
import { SiteForm } from "./sites/SiteForm";
import { SiteList } from "./sites/SiteList";
import { Portal } from "react-portal";

export const Main = () => {
  const [siteId, setSiteId] = useState<string>();

  return (
    <Panel>
      <SiteList onSiteClick={setSiteId} />
      <Actions>
        <Action>
          <IoMdAdd onClick={() => setSiteId("new")} />
        </Action>
        <Action disabled>
          <IoMdCloudUpload />
        </Action>
        <Action disabled>
          <IoMdDownload />
        </Action>
      </Actions>
      {siteId && (
        <Portal>
          <Popup>
            <SiteForm siteId={siteId} onBack={() => setSiteId(undefined)} />
          </Popup>
        </Portal>
      )}
    </Panel>
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
