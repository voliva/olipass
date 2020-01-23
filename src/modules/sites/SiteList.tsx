import { useSelector } from "@voliva/react-observable"
import { getSites } from "./sites"
import React from "react";

export const SiteList = () => {
    const sites = useSelector(getSites);

    return <div>{sites.length}</div>
}
