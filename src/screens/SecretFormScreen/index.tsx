import React from 'react';
import { Button, ButtonProperties, View } from 'react-native';
import { compose, mapProps, Omit, withState } from 'recompose';
import { headerWithRightElement } from '../../headerWithRightElement';
import { Props, SecretFormScreen } from './secretFormScreen.cmp';
import Site from './site';

const SaveButton = mapProps((props: Omit<ButtonProperties, 'title' | 'onPress'>) => ({
    ...props,
    onPress: (...args: any[]) => console.log('Save'),
    title: 'Save'
}))(Button);

export default compose<Props, {}>(
    headerWithRightElement(<View style={{marginRight: 10}}>
        <SaveButton />
    </View>),
    withState('site', 'setSite', {
        name: '',
        website: '',
        username: '',
        password: '',
        notes: ''
    }),
    mapProps((props: any) => ({
        ...props,
        onValueChange: (value: string, id: keyof Site) => {
            props.setSite({
                ...props.site,
                [id]: value
            });
        }
    }))
)(SecretFormScreen);
