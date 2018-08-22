import { Component, OnInit } from '@angular/core';
import { PasswordsService } from '../passwords.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private pswService: PasswordsService) { }

  ngOnInit() {
  }

  login(password: string) {
    if(this.pswService.setMasterPassword(password)) {
      console.log("Yeus!");
    }else {
      console.log("Oh no!");
    }
  }
}
