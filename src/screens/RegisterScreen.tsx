import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";
import { compose, mapProps, withState } from "recompose";
import { register } from "../redux/auth";

interface RegisterFormProps {
    password: string,
    repeat: string,
    onPasswordChange: (password: string) => void;
    onRepeatChange: (repeat: string) => void;
    onSubmit: () => void;
}

const isValidPassword = (password: string) =>
    password.trim().length > 3; // Changed from 8 for easy development
const isEnabled = (props: RegisterFormProps) =>
    isValidPassword(props.password) &&
    props.password === props.repeat

const getPasswordStyle = (props: RegisterFormProps) =>
    !props.password.length ? styles.input :
    isValidPassword(props.password) ? [styles.input, styles.validInput] :
    [styles.input, styles.inValidInput];

const getRepeatStyle = (props: RegisterFormProps) =>
    !props.repeat.length ? styles.input :
    isEnabled(props) ? [styles.input, styles.validInput] :
    [styles.input, styles.inValidInput];

const RegisterForm = (props: RegisterFormProps) =>
    <View
        style={styles.container}>
        <Text style={styles.explanation}>Welcome! To create a new password database, you need to set your master password</Text>
        <View style={styles.form}>
            <TextInput
                placeholder='Password'
                value={props.password}
                onChangeText={props.onPasswordChange} 
                style={getPasswordStyle(props)}
                secureTextEntry />
            <TextInput
                placeholder='Repeat password'
                value={props.repeat}
                onChangeText={props.onRepeatChange} 
                style={getRepeatStyle(props)}
                secureTextEntry />
        </View>
        <Button
            title='Create'
            onPress={props.onSubmit}
            disabled={!isEnabled(props)} />
    </View>;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    explanation: {
        padding: 10,
        fontSize: 16
    },
    form: {
        flex: 1
    },
    input: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    validInput: {
        borderBottomColor: 'green'
    },
    inValidInput: {
        borderBottomColor: 'red'
    }
})

export default compose<RegisterFormProps, {}>(
    connect(null, {
        onSubmit: register
    }),
    withState('password', 'onPasswordChange', ''),
    withState('repeat', 'onRepeatChange', ''),
    mapProps((props: any) => ({
        ...props,
        onSubmit: () => isEnabled(props) && props.onSubmit(props.password)
    }))
)(RegisterForm);