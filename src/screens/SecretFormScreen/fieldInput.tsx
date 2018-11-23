import { mapProps } from "recompose";
import { TextInputProps, TextInput, StyleSheet } from "react-native";
import Site from "./site";

export interface FieldInputProps {
    id: keyof Site;
    label: string;
    value: string;
    onChange: (value: string, props: keyof Site) => void;
    isPassword?: boolean;
    multiline?: boolean;
}

export const FieldInput = mapProps<TextInputProps, FieldInputProps>(props => ({
    placeholder: props.label,
    value: props.value,
    onChangeText: (text: string) => props.onChange(text, props.id),
    secureTextEntry: props.isPassword,
    multiline: props.multiline,
    numberOfLines: props.multiline ? 4 : 1,
    style: props.multiline ? [styles.input, styles.multilineInput] : styles.input
}))(TextInput);


const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    multilineInput: {
        flex: 1
    }
});