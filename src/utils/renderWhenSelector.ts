import { compose } from "ramda";
import { ComponentType } from "react";
import { connect } from "react-redux";
import { branch, renderNothing } from "recompose";
import { ApplicationState } from "../redux";

const hide = '__hide__' // Symbol('hide');
export const renderWhenSelector = <T extends any>(selector: (state: ApplicationState) => boolean | undefined) => compose<
    ComponentType<T>,
    ComponentType<T & { [hide]: boolean }>,
    ComponentType<T>
>(
    connect((state: ApplicationState) => ({
        [hide]: !selector(state)
    })),
    branch(props => props[hide], renderNothing),
);