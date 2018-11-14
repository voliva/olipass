import { View, TextInput, Button } from "react-native";
import React from "react";
import { compose, withState, mapProps } from "recompose";
import { connect } from "react-redux";
import { createNewDB } from "../redux/passwords";

interface RegisterFormProps {
    password: string,
    repeat: string,
    onPasswordChange: (password: string) => void;
    onRepeatChange: (repeat: string) => void;
    onSubmit: () => void;
}

const isValidPassword = (password: string) =>
    true || password.trim().length > 8;
const isEnabled = (props: RegisterFormProps) =>
    isValidPassword(props.password) &&
    props.password === props.repeat

const RegisterForm = (props: RegisterFormProps) => <View>
    <TextInput
        placeholder='Password'
        value={props.password}
        onChangeText={props.onPasswordChange} />
    <TextInput
        placeholder='Repeat password'
        value={props.repeat}
        onChangeText={props.onRepeatChange} />
    <Button title='Create' onPress={props.onSubmit} disabled={!isEnabled(props)} />
</View>

export default compose<RegisterFormProps, {
    onSubmit: (password: string) => void
}>(
    connect(null, {
        onSubmit: createNewDB
    }),
    withState('password', 'onPasswordChange', ''),
    withState('repeat', 'onRepeatChange', ''),
    mapProps((props: any) => ({
        ...props,
        onSubmit: () => isEnabled(props) && props.onSubmit(props.password)
    }))
)(RegisterForm);