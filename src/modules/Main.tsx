import { Subscribe } from "@react-rxjs/core";
import React, { useState } from "react";
import { IoMdAdd, IoMdCloudUpload, IoMdDownload } from "react-icons/io";
import { Portal } from "react-portal";
import { Panel, Popup } from "src/components/Page";
import styled from "styled-components";
import { SiteForm } from "./sites/SiteForm";
import { SiteList } from "./sites/SiteList";
import { databaseExporter, exportDatabase } from "./sync/sync";
import { Upload } from "./sync/Upload";
import { databasePersistence } from "./sites/sites";
import { merge } from "rxjs";

const effects = merge(databaseExporter, databasePersistence);

export const Main = () => {
  const [siteId, setSiteId] = useState<string>();
  const [showUpload, setShowUpload] = useState(false);

  const hideUpload = () => setShowUpload(false);

  return (
    <Panel>
      <Subscribe source$={effects}>
        <SiteList onSiteClick={setSiteId} />
      </Subscribe>
      <Actions>
        <Action onClick={() => setSiteId("new")}>
          <IoMdAdd />
        </Action>
        <Action onClick={() => setShowUpload(true)}>
          <IoMdCloudUpload />
        </Action>
        <Action onClick={() => exportDatabase.next()}>
          <IoMdDownload />
        </Action>
      </Actions>
      {siteId && (
        <Portal>
          <Popup>
            <Subscribe>
              <SiteForm siteId={siteId} onBack={() => setSiteId(undefined)} />
            </Subscribe>
          </Popup>
        </Portal>
      )}
      {showUpload && (
        <Portal>
          <Popup onClose={hideUpload}>
            <Subscribe>
              <Upload onBack={hideUpload} />
            </Subscribe>
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
