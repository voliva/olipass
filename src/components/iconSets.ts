import { Platform } from "react-native";

const branch = (android: string, ios: string) =>
    Platform.OS === 'ios' ? ios : android;

export const IconSets = {
    Web: branch('md-globe', 'ios-globe'),
    Notes: branch('md-document', 'ios-document'),
    Sync: branch('md-sync', 'ios-sync')
}
