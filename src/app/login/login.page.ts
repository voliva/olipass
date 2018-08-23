import { Component, OnInit } from '@angular/core';
import { PasswordsService } from '../passwords.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private pswService: PasswordsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(password: string) {
    if(this.pswService.setMasterPassword(password)) {
      this.router.navigate(['/'])
    }else {
      console.log("Oh no!");
    }
  }
}
