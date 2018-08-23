import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [LoginGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule' },
  { path: 'siteForm', loadChildren: './site-form/site-form.module#SiteFormPageModule' },
  { path: 'passwordGenerator', loadChildren: './password-generator/password-generator.module#PasswordGeneratorPageModule' },
  { path: 'actions', loadChildren: './actions/actions.module#ActionsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
