import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordsService } from '../passwords.service';
import { blobToBase64 } from '../actions/actions.page';
import { decryptDatabase } from '../encryption';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  constructor(
    private pswService: PasswordsService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  create(password: string) {
    this.pswService
      .clearDB()
      .setMasterPassword(password);
    
    this.router.navigate(['/']);
  }

  public selectedFile: File = null;
  public importPassword = '';
  handleFileInput(files: FileList) {
    this.selectedFile = files.item(0);
  }

  async import() {
    if(!this.selectedFile) return;

    const password = this.importPassword;

    try {
      const encryptedDb = await blobToBase64(this.selectedFile);
      const decryptedDb = decryptDatabase(encryptedDb, password);
      this.pswService
        .clearDB()
        .setMasterPassword(password);
      this.pswService.setDB(decryptedDb);

      this.router.navigate(['/']);
    }catch (ex) {
      console.error(ex);
      const toast = await this.toastController.create({
        message: 'Error importing. Wrong password?',
        duration: 3000
      });
      toast.present();
    }
  }
}
