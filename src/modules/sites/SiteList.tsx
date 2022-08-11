import { useStateObservable } from "@react-rxjs/core";
import { noop } from "lodash";
import React, { FC } from "react";
import { Header } from "src/components/Page";
import styled from "styled-components";
import { filteredSites$, filterState$, setFilter } from "./sites";

export const SiteList: FC<{ onSiteClick?: (id: string) => void }> = ({
  onSiteClick = noop,
}) => {
  const filter = useStateObservable(filterState$);
  const sites = useStateObservable(filteredSites$);

  return (
    <>
      <Header>Sites</Header>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search..."
      />
      <CappedList>
        {sites.map((site) => (
          <Site key={site.id} onClick={() => onSiteClick(site.id)}>
            {site.name || site.website}
          </Site>
        ))}
        {sites.length === 0 ? <Placeholder>No sites</Placeholder> : null}
      </CappedList>
    </>
  );
};

const CappedList = styled.div`
  max-height: 50vh;
  min-height: 10em;
  overflow: auto;
`;

const Site = styled.div`
  cursor: pointer;
  border-top: thin solid darkgray;
  padding: 0.5em 0;
`;

const Placeholder = styled.div`
  color: gray;
`;
