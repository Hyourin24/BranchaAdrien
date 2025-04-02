import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../modules/User';
import { forkJoin } from 'rxjs';
import { Follower } from '../../modules/Follower';
import { Posts } from '../../modules/Posts';
@Component({
  selector: 'app-gestion-compte',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-compte.component.html',
  styleUrl: './gestion-compte.component.css'
})
export class GestionCompteComponent {
  constructor (private router: Router, private httpTestService: ApiService) { }

  pseudo: string = ""
  email: string = "";
  password: string = "";
  pseudoList: Utilisateur[] = [];

  utilisateur: Utilisateur | null = null;
  follower: Follower | null = null;
  followerCount: number = 0
  following: Follower | null = null
  followingCount: number = 0
  post: Posts | null = null
  postCount: number = 0
    
  ngOnInit() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.router.navigate(['/connexion']);
      return;
    }
    
    this.httpTestService.getMe().subscribe(utilisateur => {
      this.utilisateur = utilisateur
      console.log("Utilisateur connecté :", this.utilisateur);
    });
    this.httpTestService.getFollowing().subscribe(following => {
      this.following = following
      this.followingCount = following.length;
      console.log("Liste abonnements", this.following)
      console.log("Nombre abonnements:", this.followingCount)
    })
    this.httpTestService.getFollower().subscribe(follower => {
      this.follower = follower
      this.followerCount = follower.length;
      console.log("Liste abonnés", this.follower)
      console.log("Nombre abonnés:", this.followerCount)
    })
    this.httpTestService.getPostsMe().subscribe(post => {
      this.post = post
      this.postCount = post.length;
      console.log("Liste post", this.post)
      console.log("Nombre posts:", this.postCount)
    })

  }
}
