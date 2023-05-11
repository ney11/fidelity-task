import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { List } from '../list.model';
import { ListsService } from '../lists.service';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit, OnDestroy{
  posts:List[] = []; 
  userIsAthenticated = false;
  userId: string | any;
  private listSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;
  isLoading = false;

  constructor(private listsService: ListsService,private authService: AuthService){}

  ngOnInit(): void { 
    this.isLoading = true;
    this.listsService.getLists();
    this.userId = this.authService.getUserId();
    this.listSub = this.listsService.getlistUpdatedListner().subscribe((lists: List[])=> {
      this.isLoading =false;
      this.posts = lists;
    })
    this.userIsAthenticated = this.authService.getAuth();
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(isAthenticated=> {
      this.userIsAthenticated = isAthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  listDelete(listId: any) {
    this.listsService.deleteList(listId);
  }

  ngOnDestroy(): void {
    this.listSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
