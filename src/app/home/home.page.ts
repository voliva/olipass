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
  private searchFilter = "";

  constructor(
    private pswService: PasswordsService,
    private modalController: ModalController
  ) {}

  public get sites() {
    return this.pswService.getDB().sites
      .filter(s => !s.deletedAt)
      .filter(s => {
        if(!this.searchFilter) return true;
        return s.name.toLowerCase().includes(this.searchFilter) ||
          s.website.toLowerCase().includes(this.searchFilter);
      })
      .sort((s1, s2) => s2.lastVisitAt - s1.lastVisitAt);
  }

  public search(value: string) {
    this.searchFilter = value.trim().toLowerCase();
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
