import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth/auth.gaurd';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ListCreateComponent } from './lists/list-create/list-create.component';
import { ListPostComponent } from './lists/list-post/list-post.component';


const routes: Routes = [
  {path: 'list', component: ListPostComponent,canActivate: [AuthGaurd]},
  {path: 'create-list', component: ListCreateComponent, canActivate: [AuthGaurd]},
  {path: 'edit/:listId', component: ListCreateComponent, canActivate: [AuthGaurd]},
  {path: '', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AppRoutingModule { }
