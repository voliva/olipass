import { Component, OnInit } from '@angular/core';
import { PasswordsService } from '../passwords.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private pswService: PasswordsService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async login(password: string) {
    if(this.pswService.setMasterPassword(password)) {
      this.router.navigate(['/'])
    }else {
      const toast = await this.toastController.create({
        message: 'Error logging in. Wrong password?',
        duration: 3000
      });
      toast.present();
    }
  }

  reset() {
    this.router.navigate(['/create']);
  }
}
