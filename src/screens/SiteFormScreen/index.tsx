import React from 'react';
import { Button, View, Alert } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { headerWithRightComponent } from '../../headerWithRightElement';
import { Unversioned } from '../../redux/globals';
import { editSite, saveSitePressed, deleteSite } from '../../redux/sites';
import { editingSiteIsReadyToSave, getSiteBeingEdited, editingSiteCanBeDeleted } from '../../redux/sites/selectors';
import { Site } from '../../redux/sites/state';
import { createMapStateToProps } from '../../utils/createMapStateToProps';
import { Props, SiteFormScreen } from './siteFormScreen';
import not from 'ramda/es/not';
import R_compose from 'ramda/es/compose';

const SaveButton = compose(
    connect(createMapStateToProps({
        disabled: R_compose(
            not,
            editingSiteIsReadyToSave
        )
    }), {
        onPress: saveSitePressed
    }),
    mapProps(props => ({
        ...props,
        title: 'Save'
    }))
)(Button);

export default compose<Props, NavigationScreenProps>(
    headerWithRightComponent(SaveButton),
    connect(createMapStateToProps({
        site: getSiteBeingEdited,
        canDelete: editingSiteCanBeDeleted
    }), {
        setSite: editSite,
        onDelete: deleteSite
    }),
    mapProps((props: any) => ({
        ...props,
        onValueChange: (value: string, id: keyof Unversioned<Site>) => {
            props.setSite({
                ...props.site,
                [id]: value
            });
        },
        onDelete: () => Alert.alert(
            'Delete site',
            `Are you sure you want to delete ${props.site.name || props.site.website}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => props.onDelete(props.site.id) },
            ]
        )
    }))
)(SiteFormScreen);
