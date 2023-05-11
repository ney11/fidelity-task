import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  userisAunthenticated = false;
  private authListnerSubs: Subscription = new Subscription;
constructor(private authService: AuthService) {}
ngOnInit(): void {
  this.userisAunthenticated = this.authService.getAuth();
  this.authService.getAuthStatusListner().subscribe(isAuthenticated=> {
    this.userisAunthenticated = isAuthenticated;
  });
}

onLogout() {
  this.authService.logOut();
}

ngOnDestroy(): void {
  this.authListnerSubs.unsubscribe();
}
}
