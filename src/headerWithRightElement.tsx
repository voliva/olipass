import React from "react";
import { View } from "react-native";
import { NavigationStackScreenOptions } from "react-navigation";

export const headerWithRightComponent = (HeaderComponent: React.ReactType<{}>) => <T extends any>(Component: React.ReactType<T>) =>
    class extends React.Component<T> {
        static navigationOptions: NavigationStackScreenOptions = {
            ...((Component as any).navigationOptions),
            headerRight: <View style={{marginRight: 10}}>
                <HeaderComponent />
            </View>
        }

        render() {
            return <Component {...this.props} />
        }
    };