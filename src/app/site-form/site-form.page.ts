import { Component, OnInit } from '@angular/core';
import { Site, createEmptySite } from '../database';
import { ModalController } from '@ionic/angular';
import { PasswordsService } from '../passwords.service';

@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.page.html',
  styleUrls: ['./site-form.page.scss'],
})
export class SiteFormPage implements OnInit {
  public site: Site = null;
  public display = false;

  constructor(
    private modalController: ModalController,
    private pswService: PasswordsService
  ) { }

  ngOnInit() {
    this.site = createEmptySite();
  }

  async cancel() {
    // this.modalController.dismiss();

    const modal = await this.modalController.create({
      component: SiteFormPage
    });
    await modal.present();
  }

  save() {
    const db = this.pswService.getDB();
    const existingSiteIdx = db.sites.findIndex(s => s.id === this.site.id);
    if(existingSiteIdx < 0) {
      db.sites.push(this.site);
    }else {
      db.sites[existingSiteIdx] = this.site;
    }
    this.pswService.setDB(db);
    this.modalController.dismiss();
  }

  toggleDisplay() {
    this.display = !this.display;
  }

  copyPassword() {
    copyText(this.site.credentials.secret);
  }
}

function copyText(text){
  function selectElementText(element) {
    if ((document as any).selection) {
      let range = (document.body as any).createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      let range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
  var element = document.createElement('DIV');
  element.textContent = text;
  document.body.appendChild(element);
  selectElementText(element);
  document.execCommand('copy');
  element.remove();
}