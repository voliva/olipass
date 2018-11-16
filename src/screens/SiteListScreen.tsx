import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StyleSheet } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import { mapProps, compose, withState } from 'recompose';
import { FlatPressList } from '../components';
import { sitePressed } from '../redux/ui';

interface Site {
    id: string;
    name: string;
}

interface Props {
    sites: Site[],
    onSitePress: (site: Site) => void,
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
        <Header
            centerComponent={{ text: 'OliPass', style: { color: '#fff' } }}
        />
        <SearchBar
            onChangeText={props.onChangeText}
            onClearText={props.onClearText}
            placeholder='Type Here...' />
        <FlatPressList
            data={props.sites}
            renderItem={SiteRenderer}
            keyExtractor={getSiteKey}
            onItemPress={props.onSitePress}
        />
    </View>
);

const sites: Site[] = [
    'reddit',
    'gmail',
    'amazon',
    'foo',
    'bar',
    'lkmreg',
    'lmkaerg',
    'aaemrlg',
    'laergml',
    'amrlgkmeagr',
    'aaesmrlg',
    'laer3gml',
    'amrlgkmeag1r'
].map(s => ({
    id: s,
    name: s
}));

const filterSites = (sites: Site[], filterText: string) => filterText.trim().length ? sites.filter(site => {
    return site.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase());
}) : sites;

export default compose<Props, {}>(
    connect(null, {
        onSitePress: sitePressed,
    }),
    withState('filterText', 'setFilterText', ''),
    mapProps((props: any) => ({
        ...props,
        sites: filterSites(sites, props.filterText),
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
    }
});
