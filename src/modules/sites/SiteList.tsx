import { useSelector } from "@voliva/react-observable";
import { getFilteredSiteList } from "./sites";
import React, { FC } from "react";
import { Header } from "src/components/Page";
import { noop } from "lodash";

export const SiteList: FC<{ onSiteClick?: (id: string) => void }> = ({
  onSiteClick = noop
}) => {
  const sites = useSelector(getFilteredSiteList, {
    filter: undefined
  });

  return (
    <>
      <Header>Sites</Header>
      <div>
        {sites.map(site => (
          <div key={site.id} onClick={() => onSiteClick(site.id)}>
            {site.name || site.website}
          </div>
        ))}
      </div>
    </>
  );
};
