import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";
import { compose, mapProps, withState } from "recompose";
import { hasFailedLogin, login } from "../redux/auth";
import { renderWhenSelector } from "../utils/renderWhenSelector";

interface LoginFormProps {
    password: string,
    onPasswordChange: (password: string) => void;
    onSubmit: () => void;
}

const LoginForm = (props: LoginFormProps) =>
    <View style={styles.container}>
        <Text style={styles.explanation}>Welcome back! Enter your master password</Text>
        <View style={styles.form}>
            <TextInput
                placeholder='Password'
                value={props.password}
                onChangeText={props.onPasswordChange} 
                style={styles.input}
                secureTextEntry />
            <LoginError />
        </View>
        <Button
            title='Login'
            onPress={props.onSubmit}
            disabled={!props.password} />
    </View>;

const LoginError = renderWhenSelector(
    hasFailedLogin
)(() => <Text style={styles.loginFailed}>Login failed, try again</Text>);

export default compose<LoginFormProps, {}>(
    connect(null, {
        onSubmit: login
    }),
    withState('password', 'onPasswordChange', ''),
    mapProps((props: any) => ({
        ...props,
        onSubmit: () => props.onSubmit(props.password)
    }))
)(LoginForm);

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
    loginFailed: {
        color: 'red',
        textAlign: 'center'
    }
});
