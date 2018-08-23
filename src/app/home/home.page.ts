import { Component } from '@angular/core';
import { PasswordsService } from '../passwords.service';
import { ModalController } from '@ionic/angular';
import { SiteFormPage } from '../site-form/site-form.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private pswService: PasswordsService,
    private modalController: ModalController
  ) {}

  public get sites() {
    return this.pswService.getDB().sites;
  }

  public async addSite() {
    const modal = await this.modalController.create({
      component: SiteFormPage
    });
    await modal.present();
  }
}
