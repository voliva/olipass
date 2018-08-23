import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SiteFormPage } from './site-form.page';
import { PasswordGeneratorPageModule } from '../password-generator/password-generator.module';

const routes: Routes = [
  {
    path: '',
    component: SiteFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PasswordGeneratorPageModule
  ],
  declarations: [SiteFormPage]
})
export class SiteFormPageModule {}