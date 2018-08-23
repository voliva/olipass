import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Options, generate } from 'generate-password-browser';

@Component({
  selector: 'app-password-generator',
  templateUrl: './password-generator.page.html',
  styleUrls: ['./password-generator.page.scss'],
})
export class PasswordGeneratorPage implements OnInit {
  public options: Options = {
    length: 8,
    numbers: false,
    symbols: false,
    uppercase: false,
    strict: true
  };
  public password: string = null;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.generate();
  }
  
  public generate() {
    this.password = generate(this.options);
  }
  
  public confirm() {
    this.modalController.dismiss(this.password);
  }
  
  public cancel() {
    this.modalController.dismiss();
  }
}
