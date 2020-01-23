import { useSelector } from "@voliva/react-observable";
import { getSites } from "./sites";
import React from "react";
import { Header } from "src/components/Page";

export const SiteList = () => {
  const sites = useSelector(getSites);

  return (
    <>
      <Header>Sites</Header>
    </>
  );
};
