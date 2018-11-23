import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { FieldInputProps, FieldInput } from "./fieldInput";
import { compose, withState, mapProps } from "recompose";

interface PasswordGeneratorProps extends FieldInputProps {
    copy: () => void;
    openGeneratePassword: () => void;
    toggleDisplay: () => void;
}

const Component = (props: PasswordGeneratorProps) => <View>
    <FieldInput {...props} />
    <View style={styles.buttonGroup}>
        <View style={styles.buttonGroupBtn}>
            <Button
                title='Copy'
                onPress={props.copy} />
        </View>
        <View style={styles.buttonGroupBtn}>
            <Button
                title='Generate'
                onPress={props.openGeneratePassword} />
        </View>
        <View style={styles.buttonGroupBtn}>
            <Button
                title={props.isPassword ? 'Display' : 'Hide'}
                onPress={props.toggleDisplay} />
        </View>
    </View>
</View>

export default compose<PasswordGeneratorProps, FieldInputProps>(
    withState('isPassword', 'setIsPassword', true),
    mapProps((props: any) => ({
        ...props,
        copy: () => console.log('copy'),
        openGeneratePassword: () => console.log('openGeneratePassword'),
        toggleDisplay: () => props.setIsPassword(!props.isPassword)
    }))
)(Component);

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    buttonGroupBtn: {
        flex: 1,
        padding: 5
    }
});
