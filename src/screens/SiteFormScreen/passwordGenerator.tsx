import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { compose, mapProps, withState } from "recompose";
import { generatePasswordPressed } from "../../redux/sites";
import { FieldInput, FieldInputProps } from "./fieldInput";

interface PasswordGeneratorProps extends FieldInputProps {
    copy: () => void;
    openGeneratePassword: () => void;
    toggleDisplay: () => void;
}

const Component = (props: PasswordGeneratorProps) => <View>
    <FieldInput {...props} isPassword />
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
                title={props.isSecret ? 'Display' : 'Hide'}
                onPress={props.toggleDisplay} />
        </View>
    </View>
</View>

export default compose<PasswordGeneratorProps, FieldInputProps>(
    connect(null, {
        openGeneratePassword: generatePasswordPressed
    }),
    withState('isSecret', 'setIsSecret', true),
    mapProps((props: any) => ({
        ...props,
        copy: () => console.log('copy'),
        toggleDisplay: () => props.setIsSecret(!props.isSecret)
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
