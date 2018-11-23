import Site from "./site";
import { ScrollView, Button } from "react-native";
import React from "react";
import { FieldInput } from "./fieldInput";
import { noop } from "redux-saga/utils";
import PasswordGenerator from './passwordGenerator';

export interface Props {
    site: Site;
    onValueChange: (value: string, id: keyof Site) => void;
}

export const SecretFormScreen = (props: Props) => (
    <ScrollView style={{flex: 1}}>
        <FieldInput
            id='name'
            label='Name'
            value={props.site.name}
            onChange={props.onValueChange} />
        <FieldInput
            id='website'
            label='Website'
            value={props.site.website}
            onChange={props.onValueChange} />
        <FieldInput
            id='username'
            label='Username'
            value={props.site.username}
            onChange={props.onValueChange} />
        <PasswordGenerator
            id='password'
            label='Password'
            value={props.site.password}
            onChange={props.onValueChange} />
        <FieldInput
            id='notes'
            label='Notes'
            value={props.site.notes}
            onChange={props.onValueChange}
            multiline />
        <Button
            title='Delete'
            onPress={noop}
            color='#f00' />
    </ScrollView>
);
