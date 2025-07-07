import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../modules/User';
import { Follower } from '../../modules/Follower';
import { forkJoin } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fil',
  imports: [CommonModule, FormsModule],
  templateUrl: './fil.component.html',
  styleUrl: './fil.component.css'
})
export class FilComponent {
  constructor (private router: Router, private route: ActivatedRoute , private httpTestService: ApiService) { }

   nouveauPost: { titre: string, post: string } = { titre: '', post: '' };
    
      pseudo: Utilisateur[] = []
      email: string = "";
      password: string = "";
      pseudoList: Utilisateur[] = [];
    
      utilisateur: Utilisateur | null = null;
      utilisateurClicke: Utilisateur | null = null;
      follower: any[] = [];
      followerCount: any [] = [];
      following: any[] = [];
      followingCount: number = 0
      followingUser: Follower | null = null;
      posts: any[] = []; 
      comment: any[] = [];
      postCount: number = 0
      idClick: number | null = null;
      resultatsFiltres: Utilisateur[] = [];
      recherche: string = '';
  
  ngOnInit() {
    

    const token = localStorage.getItem("token");
        if (!token) {
          this.router.navigate(['/connexion']);
        }
        const userId = this.route.snapshot.paramMap.get('id');
        this.idClick = userId ? parseInt(userId) : null;
        console.log("ID utilisateur dans l'URL :", userId);

        this.httpTestService.getMe().subscribe(utilisateur => {
          this.utilisateur = utilisateur
          console.log("Utilisateur connecté :", this.utilisateur);
        });
        
        if (this.idClick) {
          const id = userId;

          this.httpTestService.getUserById(this.idClick).subscribe(user => {
            this.utilisateurClicke = user;
            console.log("Utilisateur cliqué :", this.utilisateurClicke);
          });

          this.httpTestService.getPostsByUser(this.idClick).subscribe(posts => {
            this.posts = posts;
            console.log("Posts cliqués :", this.posts);
          });
        }
        // Récupérer la liste des abonnements
        this.httpTestService.getFollowing().subscribe(following => {
          this.following = following;
          this.followingCount = following.length
        });
        // Récupérer la liste des abonnés
        this.httpTestService.getFollower().subscribe(follower => {
          this.follower = follower
          this.followerCount = follower.length;
          console.log("Liste abonnés", this.follower)
          console.log("Nombre abonnés:", this.followerCount)
        })// Récupérer la liste des posts

        // Joindre les id des utilisateurs avec les user_id des abonnements
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

        this.httpTestService.getUser().subscribe((data: Utilisateur[]) => {
        this.pseudo = data;
        this.resultatsFiltres = data; // initialisation
      });
        
  }

  boutonAbonnement() {
    const abonnement = document.querySelector('.listeAbonnements') as HTMLElement;
    abonnement.style.display = 'block';
  }

  boutonCroixAbonnement() {
    const abonnement = document.querySelector('.listeAbonnements') as HTMLElement;
    abonnement.style.display = 'none';
  }

  boutonAbonnes() {
    const abonnés = document.querySelector('.listeAbonnes') as HTMLElement;
    abonnés.style.display = 'block';
  }

  boutonCroixAbonnes() {
    const abonnement = document.querySelector('.listeAbonnes') as HTMLElement;
    abonnement.style.display = 'none';
  }

  ouvrirProfil(id: number) {
    this.router.navigate(['/profil', id]);
    if (id === undefined) {
      console.error("L'ID de l'utilisateur est indéfini.");
    }
  }

  afficherCommentaire(post: any) {
    this.httpTestService.getCommentsByPost(post.id).subscribe(comments => {
      post.commentaires = comments;

      forkJoin({
        commentJoin: this.httpTestService.getCommentsByPost(post.id),
        usersJoin: this.httpTestService.getUser()
      }).subscribe(({ commentJoin, usersJoin }) => {
        post.commentaires = commentJoin.map((c: any) => {
          const user = usersJoin.find((u: any) => u.id === c.user_id);
          return {
            ...c,
            pseudo: user?.pseudo || 'Commentaire inconnu'
          };
        });
      post.isCommentsVisible = !post.isCommentsVisible;
      console.log("Commentaires :", post.commentaires);
      })
    }
  )}

   rechercheResult(): void {
    const term = this.recherche
    this.resultatsFiltres = this.pseudo.filter(utilisateur =>
      utilisateur.pseudo.includes(term)
    );
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
