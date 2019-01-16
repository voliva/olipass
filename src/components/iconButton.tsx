import React from "react";
import { StyleProp, Text, TouchableHighlight, View, ViewStyle } from "react-native";
import Icon from "react-native-ionicons";

interface IconButtonProps {
    icon: string;
    title: string;
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

export const IconButton = ({icon, title, style, onPress}: IconButtonProps) =>
    <TouchableHighlight underlayColor="white" onPress={onPress} style={{
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        ...style
    }}>
        <View style={{flex: 0, alignItems: 'center'}}>
        <Icon name={icon} />
        <Text>{title}</Text>
        </View>
    </TouchableHighlight>