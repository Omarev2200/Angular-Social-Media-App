import { Injectable, NgZone } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { IUser } from "../interfaces/user";
import { IPost } from "../interfaces/post";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class PostService {
  // private currentUserId: string = JSON.parse(localStorage.getItem("user")).uid;
  private _allPosts: IPost[] = [];
  constructor(
    private afDb: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) {}

  addPost(post: Observable<IPost>) {
    this.ngZone.run(() => {
      this.router.navigate(["all-posts"]);
    });
    post.subscribe({
      next: post => {
        return this.afDb
          .collection("users", ref => {
            return ref.where("id", "==", post.createdBy).limit(1);
          })
          .snapshotChanges()
          .pipe(map(x => x[0].payload.doc.data()))
          .subscribe({
            next: (user: IUser) => {
              return this.afDb
                .collection("posts")
                .doc(post.id)
                .set(post, {
                  merge: true
                });
            },
            error: err => console.error(err)
          });
      },
      error: err => console.error(err)
    });
  }

  getAllPost() {
    return this.afDb
      .collection("posts")
      .ref.get()
      .then(allPosts => {
        return allPosts.docs.map(post => post.data());
      });
  }

  getPost(id) {}
}