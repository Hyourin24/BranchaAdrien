import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Follower } from '../../modules/Follower';
import { Utilisateur } from '../../modules/User';
import { forkJoin } from 'rxjs';
import { Posts } from '../../modules/Posts';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  nouveauPost: { titre: string, post: string } = { titre: '', post: '' };


  follower: Follower[] = [];
  followersList: Follower[] = [];
  pseudo: Utilisateur[] = [];
  titre: Posts[] = [];
  password: string = "";
  
  email: string = "";
  pseudoList: Utilisateur[] = [];
  utilisateur: Utilisateur | null = null;
  followerCount: any [] = [];
  following: any[] = [];
  followingCount: number = 0
  followingUser: Follower | null = null;
  posts: any[] = []; 
  postCount: number = 0
  constructor (private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    const token = localStorage.getItem("token");

    this.httpTestService.getFollowing().subscribe(followers => {
      this.followersList = followers;
      console.log(this.followersList);
    })
    if (!token) {
          this.router.navigate(['/connexion']);
        }
        // Récupérer l'utilisateur connecté
        this.httpTestService.getMe().subscribe(utilisateur => {
          this.utilisateur = utilisateur
          console.log("Utilisateur connecté :", this.utilisateur);
        });
        // Récupérer la liste des abonnements
        this.httpTestService.getFollowing().subscribe(following => {
          this.following = following;
          this.followingCount = following.length;
        });
        // Récupérer la liste des abonnés
        this.httpTestService.getPosts().subscribe(posts => {
          this.posts = posts
          console.log("Lists de tous les posts", this.posts)
        })

        forkJoin({
          followingJoin: this.httpTestService.getFollowing(),
          usersJoin: this.httpTestService.getUser()
        }).subscribe(({ followingJoin, usersJoin }) => {
          this.following = followingJoin;
          this.pseudo = usersJoin;
          this.following = this.following.map(f => {
            const user = this.pseudo.find(u => u.id === f.abonne_id);
            return {
              ...f,
              utilisateur: user
            };
          });
          console.log("Liste abonnements enrichis", this.following);
        });
        //Joindre les id des utilisateurs avec les user_id des posts
        forkJoin({
          followerJoin: this.httpTestService.getFollower(),
          usersJoin: this.httpTestService.getUser()
        }).subscribe(({ followerJoin, usersJoin }) => {
          this.follower= followerJoin;
          this.pseudo = usersJoin;
          this.follower = this.follower.map(f => {
            const user = this.pseudo.find(u => u.id === f.user_id); 
            return {
              ...f,
              utilisateur: user
            };
          });
          console.log("Liste abonnés enrichiis", this.follower);
        });
        forkJoin({
          postJoin: this.httpTestService.getPosts(),
          usersJoin: this.httpTestService.getUser()
        }).subscribe(({ postJoin, usersJoin }) => {
          this.posts = postJoin;
          this.pseudo = usersJoin;
          const abonnementsIds = this.following.map(f => f.abonne_id);
          // Filtrer les posts
          this.posts = this.posts.filter((post: { user_id: number | undefined; }) => 
             abonnementsIds.includes(post.user_id)
          );
          this.posts = this.posts.map(p => {
            const auteur = this.pseudo.find(u => u.id === p.user_id);
            return {
              ...p,
              utilisateur: auteur ? auteur : { pseudo: 'Auteur inconnu', avatar: 'url_default' }
            };
          })
          console.log("Liste posts enrichis", this.posts);
          console.log('Posts:', this.posts);
          console.log('Users:', this.pseudo);
        })
  }

  createPost() {
     const postBody = {
      titre: this.nouveauPost.titre, 
      post: this.nouveauPost.post
    };
    this.httpTestService.createPost(postBody).subscribe({
      next: (response) => {
        console.log("Post créé :", response);
        this.nouveauPost.titre = '';
        this.nouveauPost.post = '';
        console.log("Data envoyée :", this.nouveauPost);
        window.location.reload();
      },
      error: (error) => {
        console.error("Erreur création :", error);
        alert("Le titre et la description du post sont requis.");
      }
    });
  }

  boutonCreatePost() {
    const post = document.querySelector('.createPost') as HTMLElement;
    post.style.display = 'block';
  }

  boutonCroixPost() {
    const post = document.querySelector('.createPost') as HTMLElement;
    post.style.display = 'none';
  }

  pageAccueil() {
    this.router.navigate(['/accueil']);
  }

  pageSession() {
    this.router.navigate(['/session']);
  }

  pageProfil() {
    this.router.navigate(['/gestion']);
  }

  pageSearch() {
    this.router.navigate(['/fil']);
  }

  pageSetting() {
    this.router.navigate(['/setting']);
  }

  pageDeconnexion() {
    this.router.navigate(['/connexion']);
    this.httpTestService.deleteToken()

  }
}
