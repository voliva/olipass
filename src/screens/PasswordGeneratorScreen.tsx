import React from "react";
import { Button, StyleSheet, Text, View, Slider, Switch } from "react-native";
import { connect } from "react-redux";
import { compose, mapProps, withState } from "recompose";
import { Options, generate } from 'generate-password-browser';
import { login } from "../redux/auth";
import { headerWithRightElement } from "../headerWithRightElement";

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

export default compose<PasswordGeneratorProps, {}>(
    headerWithRightElement(<View style={{marginRight: 10}}>
        <Button title='OK'
            onPress={() => console.log('ok')} />
    </View>),
    connect(null, {
        onSubmit: login
    }),
    withState<Options, Options, 'options', 'setOptions'>(
        'options',
        'setOptions',
        {
            length: 8,
            uppercase: false,
            numbers: false,
            symbols: false,
            strict: true
        }
    ),
    withState(
        'password',
        'setPassword',
        (props: {options: Options}) => generate(props.options)
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
            props.setPassword(generate(newOptions));
        },
        onGenerate: () => props.setPassword(generate(props.options))
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
