import { mapObjIndexed } from "ramda";
import { ParametricSelector } from "reselect";
import { ApplicationState } from "../redux";

export const createMapStateToProps = <TProps extends any>(selectorsMap: {[key: string]: ParametricSelector<ApplicationState, TProps, any>}) =>
    (state: ApplicationState, props: TProps) => mapObjIndexed(selector => selector(state, props), selectorsMap);
