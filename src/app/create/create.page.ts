import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordsService } from '../passwords.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  constructor(private pswService: PasswordsService, private router: Router) { }

  ngOnInit() {
  }

  create(password: string) {
    this.pswService
      .clearDB()
      .setMasterPassword(password);
    
    this.router.navigate(['/login']);
  }
}
