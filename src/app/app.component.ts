import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { List } from './lists/list.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'emirates-task';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
