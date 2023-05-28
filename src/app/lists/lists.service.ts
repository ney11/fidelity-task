import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, Subject } from "rxjs";
// import { environment } from "src/environments/environment";
import { List } from "./list.model";
import { environment } from "src/environments/environment.prod";

// const BACKEND_URL ="http://localhost:3000/api/lists/";
const BACKEND_URL = environment.apiUrl + "/lists/";

@Injectable({providedIn: 'root'})
export class ListsService {
    private lists: List[] = [];
    private listsUpdated = new Subject<List[]>();

    constructor(private http: HttpClient, private router: Router){}

    getLists() {
        // this.http.get<{message: string, lists: any}>("http://localhost:3000/api/lists")
        // .subscribe((listData)=> {
        //     this.lists = listData.lists;
        //     this.listsUpdated.next([...this.lists]);
        // });
        this.http
      .get<{ message: string; lists: any }>(
        BACKEND_URL
      )
      .pipe(map((postData) => {
        return postData.lists.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            creator: post.creator
          };
        });
      }))
      .subscribe(transformedPosts => {
        console.log(transformedPosts)
        this.lists = transformedPosts;
        this.listsUpdated.next([...this.lists]);
      });
    }

    getlistUpdatedListner() {
        return this.listsUpdated.asObservable();
    }

    addList(title: string, content: string) {
        // const list: List = {title: title, content: content};
        // this.http.post<{message:string}>("http://localhost:3000/api/lists", list)
        // .subscribe((responseData)=> {
        //     console.log(responseData.message);
        //     this.lists.push(list);
        //     this.listsUpdated.next([...this.lists]);
        // })
        const list: List = {id: null, title: title, content: content , creator: null};
    this.http
      .post<{ message: string, postId: string }>(BACKEND_URL, list)
      .subscribe(responseData => {
        const id = responseData.postId;
        list.id = id;
        this.lists.push(list);
        this.listsUpdated.next([...this.lists]);
        this.router.navigate(['/list']);
      });
    }

    getList(id: string){
        // return {...this.lists.find(p=>p.id===id)};
        // <{_id: string; title: string; content: string }>
        return this.http.get<{_id: string; title: string; content: string, creator: string }>(BACKEND_URL + id);
    }

    updateList(id: string, title: string, content: string){
        const list: List = {id: id, title: title, content: content, creator: null};
        this.http.put(BACKEND_URL + id, list).subscribe((response)=>{
            const updatedLists = [...this.lists];
            const oldListIndex = updatedLists.findIndex(p=> p.id === list.id);
            updatedLists[oldListIndex] = list;
            this.lists = updatedLists;
            this.listsUpdated.next([...this.lists]);
            this.router.navigate(['/list']);
        })
    }

    deleteList(listId: any) {
        this.http.delete(BACKEND_URL + listId).subscribe(()=>{
            const updatedLists = this.lists.filter(list=>list.id !== listId);
            this.lists = updatedLists;
            this.listsUpdated.next([...this.lists]);
        })
    }
}