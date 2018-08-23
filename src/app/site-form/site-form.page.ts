import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { createEmptySite, Site } from '../database';
import { PasswordGeneratorPage } from '../password-generator/password-generator.page';
import { PasswordsService } from '../passwords.service';

@Component({
  selector: 'app-site-form',
  templateUrl: './site-form.page.html',
  styleUrls: ['./site-form.page.scss'],
})
export class SiteFormPage implements OnInit {
  public site: Site = null;
  public upserting = false;
  public display = false;

  constructor(
    private modalController: ModalController,
    private pswService: PasswordsService,
    private navParams: NavParams,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const id = this.navParams.get('id');
    if(id) {
      const db = this.pswService.getDB();
      this.site = db.sites.find(s => s.id === id);
      this.upserting = true;
    }else {
      this.site = createEmptySite();
      this.upserting = false;
    }
  }

  cancel() {
    this.modalController.dismiss();
  }

  async delete() {
    if(!await this.confirmDelete()) return;
    
    this.site.updatedAt = new Date().getTime();
    this.site.deletedAt = new Date().getTime();
    const db = this.pswService.getDB();
    const existingSiteIdx = db.sites.findIndex(s => s.id === this.site.id);
    if(existingSiteIdx < 0) {
      return;
    }
    db.sites[existingSiteIdx] = this.site;
    this.pswService.setDB(db);
    this.modalController.dismiss();
  }

  save() {
    if(!this.canSave()) return;
    this.site.updatedAt = new Date().getTime();
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

  async generatePassword() {
    const modal = await this.modalController.create({
      component: PasswordGeneratorPage
    });
    modal.onWillDismiss(evt => evt.data ? this.site.credentials.secret = evt.data : null);
    await modal.present();
  }

  canSave() {
    return (this.site.name || this.site.website) && this.site.credentials.secret;
  }

  private confirmDelete() {
    return new Promise(resolve => {
      this.alertController.create({
        header: 'Confirm delete',
        message: 'Are you sure you want to delete this site?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          }, {
            text: 'Okay',
            handler: () => resolve(true)
          }
        ]
      });
    });
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