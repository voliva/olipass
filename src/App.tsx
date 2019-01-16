import React from 'react';
import { NavigationContainerComponent, NavigationState, NavigationAction, NavigationContainerProps } from 'react-navigation';
import AppNavigator, { setTopLevelNavigator } from './navigation';
import { Provider } from './redux';
import { connect } from 'react-redux';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';

function requestStoragePermission() {
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ).then(granted => {
        if(!granted) {
            return Promise.reject<string>('not granted');
        }
        return granted;
    });
}

DocumentPicker.show({
    filetype: [DocumentPickerUtil.allFiles()],
}, (error: any,res: any) => {
    if(error) {
        console.warn(error);
        return;
    }

    console.log(
        res.uri,
        res.type, // mime type
        res.fileName,
        res.fileSize,
        res
    );

    const path = RNFS.DownloadsDirectoryPath + "/test.enc";
    requestStoragePermission()
        .then(() => RNFS.readFile(res.uri, 'base64'))
        .then(res => {
            console.log('length', res.length);

            console.log('Will svave to', path);
            return RNFS.writeFile(path, res, 'base64');
        })
        .then(() => {
            console.log('saved, reading');
            return RNFS.readFile(path, 'base64');
        })
        .then(res => console.log('res', res.length))
        .then(
            (...args) => console.log('complete', args),
            err => console.log(err)
        );
});


const handleNavigatorRef = (ref: NavigationContainerComponent) => setTopLevelNavigator(ref);

const App = connect(null,
    dispatch => ({
        handleNavigationStateChange: (
            prevNavigationState: NavigationState,
            nextNavigationState: NavigationState,
            action: NavigationAction
        ) => {
            (action as any).metadata = {
                ...(action as any).metadata,
                prevNavigationState,
                nextNavigationState
            };
            dispatch(action);
        }
    })
)
(({ handleNavigationStateChange }: { handleNavigationStateChange: NavigationContainerProps['onNavigationStateChange'] } ) => (
    <AppNavigator
        ref={handleNavigatorRef}
        onNavigationStateChange={handleNavigationStateChange} />)
);

export default class extends React.Component {
    componentDidMount() {
        // Font.loadAsync({
        //     'share-tech-mono': require('../assets/fonts/ShareTechMono-Regular.ttf'),
        // });
    }

    render = () => (
        <Provider>
            <App />
        </Provider>
    );
}
