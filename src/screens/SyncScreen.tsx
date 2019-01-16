import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { IconButton } from '../components/iconButton';
import { exportPressed, importPressed, importPswSubmitted } from '../redux/sync';
import { createMapStateToProps } from '../utils/createMapStateToProps';
import { needsPrompt } from '../redux/sync/selectors';
import DialogInput from 'react-native-dialog-input';

interface SyncScreenProps {
  showImportPrompt: boolean,
  importPressed: () => void,
  exportPressed: () => void,
  onSubmitImportPsw: (password: string) => void,
  onDismissImportPsw: () => void
}

const SyncScreen = ({
  importPressed,
  exportPressed,
  showImportPrompt,
  onSubmitImportPsw,
  onDismissImportPsw
}: SyncScreenProps) => <View style={{flex: 1}}>
  <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
    <IconButton
      style={{margin: 10}}
      icon='cloud-upload'
      title='Export'
      onPress={exportPressed} />
    <IconButton
      style={{margin: 10}}
      icon='cloud-download'
      title='Import'
      onPress={importPressed} />
  </View>
  <DialogInput isDialogVisible={showImportPrompt}
    title='Import'
    message='Enter file password'
    submitInput={onSubmitImportPsw}
    closeDialog={onDismissImportPsw}>
  </DialogInput>
</View>

export default connect(
  createMapStateToProps({
    showImportPrompt: needsPrompt
  }),
  {
    importPressed,
    exportPressed,
    onSubmitImportPsw: importPswSubmitted,
    onDismissImportPsw: () => importPswSubmitted('')
  }
)(SyncScreen);
