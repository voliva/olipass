import React from "react";
import { FlatList, FlatListProps, TouchableOpacity, ListRenderItemInfo } from "react-native";

type Props<T> = FlatListProps<T> & {
    onItemPress: (info: T, index: number) => void
}

export default class FlatPressList<T> extends React.Component<Props<T>> {

    private renderItem = (info: ListRenderItemInfo<T>) => (
        <TouchableOpacity
            onPress={() => this.props.onItemPress(info.item, info.index)}
        >
            { this.props.renderItem(info) }
        </TouchableOpacity>
    );
    
    render() {
        return <FlatList
            {...this.props}
            renderItem={this.renderItem}
        />
    }
}
