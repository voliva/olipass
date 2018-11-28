import React from "react";
import { Button, ScrollView } from "react-native";
import { Unversioned } from "../../redux/globals";
import { Site } from "../../redux/sites/state";
import { FieldInput } from "./fieldInput";
import PasswordGenerator from './passwordGenerator';

export interface Props {
    site: Unversioned<Site>;
    canDelete: boolean;
    onValueChange: (value: string, id: keyof Unversioned<Site>) => void;
    onDelete: () => void;
}

export const SiteFormScreen = (props: Props) => (
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
        { props.canDelete && <Button
            title='Delete'
            onPress={props.onDelete}
            color='#f00' /> }
    </ScrollView>
);
