import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { List } from '../list.model';
import { ListsService } from '../lists.service';

@Component({
  selector: 'app-list-create',
  templateUrl: './list-create.component.html',
  styleUrls: ['./list-create.component.css']
})
export class ListCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = ''
  postCreated: any;
  form: any;
  private mode = 'create';
  private listId: string | any;
  list: List | any;
  isLoading = false;

  constructor(private listsService: ListsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,{
        validators: [Validators.required,Validators.minLength(3)]
      }),
      content: new FormControl(null,{
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=> {
      if(paramMap.has('listId')){
        this.mode = 'edit'
        this.listId = paramMap.get('listId');
        this.isLoading = true;
        // this.list = this.listsService.getList(this.listId)
        this.listsService.getList(this.listId).subscribe((listData)=> {
          this.isLoading = false;
          this.list = {id: listData._id, title: listData.title, content: listData.content};
          this.form.setValue({
            title: this.list.title,
            content: this.list.content
          })
        });
      }else {
        this.mode = 'create';
        this.listId = null;
      }
    })
  }

  onSaveList() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.listsService.addList(this.form.value.title,this.form.value.content);
      window.location.reload();
    } else {
      this.listsService.updateList(
        this.listId,
        this.form.value.title,
        this.form.value.content
      );
    }
    
    this.form.reset();
  }
}
