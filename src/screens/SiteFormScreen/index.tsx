import React from 'react';
import { Button, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { headerWithRightElement } from '../../headerWithRightElement';
import { ApplicationState } from '../../redux';
import { Unversioned } from '../../redux/globals';
import { saveSitePressed, editSite } from '../../redux/sites';
import { getSiteBeingEdited } from '../../redux/sites/selectors';
import { Site } from '../../redux/sites/state';
import { Props, SiteFormScreen } from './siteFormScreen.cmp';

const SaveButton = compose(
    connect(null, {
        onPress: saveSitePressed
    }),
    mapProps(props => ({
        ...props,
        title: 'Save'
    }))
)(Button);

const preserveNavigation = (hoc: (Component: React.ComponentType) => React.ComponentType) => (Component: React.ComponentType) => {
    const TransformedComponent = hoc(Component);
    return class extends React.Component {
        static navigationOptions = {
            ...((Component as any).navigationOptions)
        }

        render() {
            return <TransformedComponent {...this.props}/>
        }
    }
};

export default compose<Props, NavigationScreenProps>(
    preserveNavigation(
        connect((state: ApplicationState, props: NavigationScreenProps) => ({
            site: getSiteBeingEdited(state)
        }), {
            setSite: editSite
        })
    ),
    headerWithRightElement(<View style={{marginRight: 10}}>
        <SaveButton />
    </View>),
    mapProps((props: any) => ({
        ...props,
        onValueChange: (value: string, id: keyof Unversioned<Site>) => {
            props.setSite({
                ...props.site,
                [id]: value
            });
        }
    }))
)(SiteFormScreen);
