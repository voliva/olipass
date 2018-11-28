import { Options } from 'generate-password-browser';
import React from "react";
import { Button, Slider, StyleSheet, Switch, Text, View } from "react-native";
import { connect } from "react-redux";
import { compose, mapProps, withState } from "recompose";
import { headerWithRightComponent } from "../headerWithRightElement";
import { acceptGeneratedPassword, requestPasswordRegen } from "../redux/sites";
import { initialPswGenOptions } from "../redux/sites/saga";
import { getLastPasswordGenerated } from "../redux/sites/selectors";
import { createMapStateToProps } from "../utils/createMapStateToProps";

interface PasswordGeneratorProps {
    password: string,
    options: Options,
    onOptionChange: <T extends keyof Options>(
        key: T,
        value: Options[T]
    ) => void,
    onGenerate: () => void
}

const BooleanOption = (props: {
    label: string,
    value: boolean | undefined,
    onValueChange: (value: boolean) => void
}) => <View style={styles.switchContainer}>
    <Text>{props.label}</Text>
    <Switch 
        value={props.value}
        onValueChange={props.onValueChange} />
</View>

const toFixedDigits = (n: number, digits: number) => {
    const n_str = n.toString(10);
    return [...new Array(
        Math.max(0, digits - n_str.length)
    )].map(_ => 0)
        .join('')
        + n_str;
}

const PasswordGenerator = (props: PasswordGeneratorProps) =>
    <View>
        <View style={styles.passwordContainer}>
            <Text style={styles.password}>{props.password}</Text>
        </View>
        <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
                {toFixedDigits(props.options.length || 0, 2)}
            </Text>
            <Slider
                style={styles.slider}
                minimumValue={4}
                maximumValue={20}
                step={1}
                value={props.options.length}
                onValueChange={v => props.onOptionChange('length', v)} />
        </View>
        <BooleanOption
            label='Uppercase'
            value={props.options.uppercase}
            onValueChange={v => props.onOptionChange('uppercase', v)} />
        <BooleanOption
            label='Numbers'
            value={props.options.numbers}
            onValueChange={v => props.onOptionChange('numbers', v)} />
        <BooleanOption
            label='Symbols'
            value={props.options.symbols}
            onValueChange={v => props.onOptionChange('symbols', v)} />
        <Button
            title='Generate'
            onPress={props.onGenerate} />
    </View>;

const SubmitButton = compose(
    connect(null, {
        onPress: acceptGeneratedPassword
    }),
    mapProps(props => ({
       ...props,
       title: 'OK' 
    }))
)(Button);

export default compose<PasswordGeneratorProps, {}>(
    headerWithRightComponent(SubmitButton),
    connect(createMapStateToProps({
        password: getLastPasswordGenerated
    }), {
        requestPasswordRegen
    }),
    withState<Options, Options, 'options', 'setOptions'>(
        'options',
        'setOptions',
        initialPswGenOptions
    ),
    mapProps((props: any) => ({
        ...props,
        onOptionChange: <T extends keyof Options>(
            key: T,
            value: Options[T]
        ) => {
            const newOptions = {
                ...props.options,
                [key]: value
            };
            props.setOptions(newOptions);
            props.requestPasswordRegen(newOptions);
        },
        onGenerate: () => props.requestPasswordRegen(props.options)
    }))
)(PasswordGenerator);

const styles = StyleSheet.create({
    passwordContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    password: {
        fontSize: 18,
        fontFamily: 'share-tech-mono'
    },
    sliderContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sliderValue: {
        fontFamily: 'monospace' // TODO Courier for iOS
    },
    slider: {
        paddingLeft: 10,
        flex: 1
    },
    switchContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
