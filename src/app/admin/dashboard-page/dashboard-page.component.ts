
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit,OnDestroy {

  posts:Post [] = []
  pSub:Subscription
  dSub:Subscription
  searchStr =''
  loadin=false
  constructor(
    private postService: PostService,
    private alert:AlertService
  ) { }

  ngOnInit(): void {
    this.loadin=true
    this.pSub = this.postService.getAll().subscribe(posts=>{
      this.loadin = false
      this.posts = posts
    })
  }

  remove(id:string) {
    this.dSub=this.postService.remove(id).subscribe(()=>{
      this.posts=this.posts.filter(post=>post.id!==id)
      this.alert.danger('Пост был удалён')
    })
  }


  ngOnDestroy() {
    if(this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.dSub) {
      this.dSub.unsubscribe()
    }
  }
}
