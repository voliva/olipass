import { useSelector } from "@voliva/react-observable";
import { noop } from "lodash";
import React, { FC } from "react";
import { Header } from "src/components/Page";
import { useInputState } from "src/lib/useInputState";
import styled from "styled-components";
import { getFilteredSiteList } from "./sites";

export const SiteList: FC<{ onSiteClick?: (id: string) => void }> = ({
  onSiteClick = noop
}) => {
  const [filter, handleFilterChange] = useInputState();
  const sites = useSelector(getFilteredSiteList, {
    filter
  });

  return (
    <>
      <Header>Sites</Header>
      <input
        value={filter}
        onChange={handleFilterChange}
        placeholder="Search..."
      />
      <CappedList>
        {sites.map(site => (
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
