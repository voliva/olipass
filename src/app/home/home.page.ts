import { Component } from '@angular/core';
import { PasswordsService } from '../passwords.service';
import { ModalController } from '@ionic/angular';
import { SiteFormPage } from '../site-form/site-form.page';
import { Site } from '../database';

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
    return this.pswService.getDB().sites
      .filter(s => !s.deletedAt)
      .sort((s1, s2) => s2.lastVisitAt - s1.lastVisitAt);
  }

  public async addSite() {
    const modal = await this.modalController.create({
      component: SiteFormPage
    });
    await modal.present();
  }
  public async editSite(site: Site) {
    const modal = await this.modalController.create({
      component: SiteFormPage,
      componentProps: {
        id: site.id
      }
    });
    await modal.present();
  }
}
