import { Component, OnInit } from '@angular/core';
import { PasswordsService } from '../passwords.service';
import * as dateFormat from 'dateformat';
import { saveAs } from 'file-saver';
import { decryptDatabase } from '../encryption';
import { mergeDatabase } from '../database';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.page.html',
  styleUrls: ['./actions.page.scss'],
})
export class ActionsPage implements OnInit {
  public importPassword = '';
  public selectedFile: File = null;

  constructor(
    private pswService: PasswordsService
  ) { }

  ngOnInit() {
  }

  async import() {
    if(!this.canImport) return;

    try {
      const encryptedDb = await blobToBase64(this.selectedFile);
      const decryptedDb = decryptDatabase(encryptedDb, this.importPassword);
      const localDb = this.pswService.getDB();
      const mergedDb = mergeDatabase(localDb, decryptedDb);
      this.pswService.setDB(mergedDb);
    }catch (ex) {
      console.log(ex);
    }
  }

  get canImport(){
    return this.importPassword && this.selectedFile;
  }

  handleFileInput(files: FileList) {
    this.selectedFile = files.item(0);
  }

  export() {
    const base64String = this.pswService.getEncryptedDB();
    const blob = b64toBlob(base64String, 'application/octet-stream');
    const filename = dateFormat(new Date(), 'yyyymmdd.psw');
    saveAs(blob, filename);
  }
}

function blobToBase64(blob: Blob) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const buffer = reader.result as ArrayBuffer;
      resolve(buffer);
    };
    reader.onerror = err => reject(err);
    reader.readAsArrayBuffer(blob);
  }).then(buffer => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  });
}

function b64toBlob(b64Data: string, contentType: string, sliceSize = 512) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}