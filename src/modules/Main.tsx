import React, { useState } from "react";
import { IoMdAdd, IoMdCloudUpload, IoMdDownload } from "react-icons/io";
import { Panel, Popup } from "src/components/Page";
import styled from "styled-components";
import { SiteForm } from "./sites/SiteForm";
import { SiteList } from "./sites/SiteList";
import { Portal } from "react-portal";
import { syncStore } from "./sync/sync";
import { exportDatabase } from './sync/actions';
import { useRegisterStores, useAction } from "@voliva/react-observable";
import { Upload } from "./sync/Upload";

export const Main = () => {
  const [siteId, setSiteId] = useState<string>();
  const [showUpload, setShowUpload] = useState(false);
  const dispatchExport = useAction(exportDatabase);
  useRegisterStores([syncStore]);

  const hideUpload = () => setShowUpload(false);

  return (
    <Panel>
      <SiteList onSiteClick={setSiteId} />
      <Actions>
        <Action onClick={() => setSiteId("new")}>
          <IoMdAdd />
        </Action>
        <Action onClick={() => setShowUpload(true)}>
          <IoMdCloudUpload />
        </Action>
        <Action onClick={dispatchExport}>
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
      {showUpload && (
        <Portal>
          <Popup onClose={hideUpload}>
            <Upload onBack={hideUpload} />
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
