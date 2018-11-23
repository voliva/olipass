import React from "react";
import { NavigationStackScreenOptions } from "react-navigation";

export const headerWithRightElement = (element: JSX.Element) => <T extends any>(Component: React.ReactType<T>) =>
    class extends React.Component<T> {
        static navigationOptions: NavigationStackScreenOptions = {
            ...((Component as any).navigationOptions),
            headerRight: element
        }

        render() {
            return <Component {...this.props} />
        }
    };