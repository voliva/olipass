import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { compose, mapProps, withState } from 'recompose';
import { FlatPressList } from '../components';
import { sitePressed, createSitePressed } from '../redux/sites';
import { getAllSites } from '../redux/sites/selectors';
import { createMapStateToProps } from '../utils/createMapStateToProps';
import Icon from 'react-native-ionicons';

interface Site {
    id: string;
    name: string;
}

interface Props {
    sites: Site[],
    onSitePress: (site: Site) => void,
    onCreateSite: () => void,
    onChangeText: (txt: string) => void,
    onClearText: () => void
}

const SiteRenderer = ({item}: {item: Site}) => <View style={styles.siteItem}>
    <Text>{item.name}</Text>
    <Text>&gt;</Text>
</View>

const getSiteKey = (site: Site) => site.id;

const SiteListScreen = (props: Props) => (
    <View style={{flex: 1}}>
        <FlatPressList
            data={props.sites}
            renderItem={SiteRenderer}
            keyExtractor={getSiteKey}
            onItemPress={props.onSitePress}
        />
        <TouchableOpacity onPress={props.onCreateSite} style={styles.fab}>
            <Icon name='add' />
        </TouchableOpacity>
    </View>
);

const filterSites = (sites: Site[], filterText: string) => filterText.trim().length ? sites.filter(site => {
    return site.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase());
}) : sites;

export default compose<Props, {}>(
    connect(
        createMapStateToProps({
            sites: getAllSites
        }),
        {
            onSitePress: sitePressed,
            onCreateSite: createSitePressed
        }
    ),
    withState('filterText', 'setFilterText', ''),
    mapProps((props: any) => ({
        ...props,
        sites: filterSites(props.sites, props.filterText),
        onChangeText: (txt: string) => props.setFilterText(txt),
        onClearText: () => props.setFilterText('')
    }))
)(SiteListScreen);

const styles = StyleSheet.create({
    siteItem: {
        height: 65,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'white',
        backgroundColor: '#ddd',
        borderBottomWidth: 1
    },
    fab: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#aae',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
