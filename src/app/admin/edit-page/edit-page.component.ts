import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/post.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form:FormGroup
  post:Post
  submitted = false

  uSub: Subscription

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private postService:PostService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params:Params)=>{
        return this.postService.getById(params['id'])
      })
    ).subscribe((post:Post)=>{
      this.post = post
      this.form = new FormGroup ({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      })
    })
  }

  ngOnDestroy() {
    if(this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  submit() {
    if(this.form.invalid) {
      return
    }
    this.submitted = true
    this.uSub=this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title
    }).subscribe(()=> {
      this.submitted = false
      this.alert.warning('Пост обновлён')
      this.router.navigate(['/admin/dashboard'])
    })
  }
}
