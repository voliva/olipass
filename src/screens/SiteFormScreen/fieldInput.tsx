import { StyleSheet, TextInput, TextInputProps, RegisteredStyle, Platform } from "react-native";
import { mapProps } from "recompose";
import { Unversioned } from "../../redux/globals";
import { Site } from "../../redux/sites/state";

export interface FieldInputProps {
    id: keyof Unversioned<Site>;
    label: string;
    value: string;
    onChange: (value: string, props: keyof Unversioned<Site>) => void;
    isSecret?: boolean;
    isPassword?: boolean;
    multiline?: boolean;
}

const getStyle = (props: FieldInputProps) => {
    const style: RegisteredStyle<any>[] = [styles.input];
    if(props.multiline) {
        style.push(styles.multilineInput);
    }
    if(props.isPassword) {
        style.push(styles.passwordInput);
    }
    return style;
}

export const FieldInput = mapProps<TextInputProps, FieldInputProps>(props => ({
    placeholder: props.label,
    value: props.value,
    onChangeText: (text: string) => props.onChange(text, props.id),
    secureTextEntry: props.isSecret,
    multiline: props.multiline,
    numberOfLines: props.multiline ? 4 : 1,
    style: getStyle(props)
}))(TextInput);


const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    multilineInput: {
        flex: 1
    },
    passwordInput: {
        fontFamily: Platform.OS === 'ios' ? 'Share Tech Mono' : 'ShareTechMono-Regular'
    }
});