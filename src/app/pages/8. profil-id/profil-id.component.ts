import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Utilisateur } from '../../modules/User';
import { Follower } from '../../modules/Follower';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profil-id',
  imports: [FormsModule, CommonModule],
  templateUrl: './profil-id.component.html',
  styleUrl: './profil-id.component.css'
})
export class ProfilIdComponent {
  constructor (private router: Router, private route: ActivatedRoute , private httpTestService: ApiService) { }
  
     nouveauPost: { titre: string, post: string } = { titre: '', post: '' };
     isFollowed = false;
      
    pseudo: Utilisateur[] = []
    email: string = "";
    password: string = "";
    pseudoList: Utilisateur[] = [];
  
    utilisateur: Utilisateur | null = null;
    utilisateurClicke: Utilisateur | null = null;
    follower: any[] = [];
    followerId: any[] = [];
    followerCount: number = 0
    followerCountId: number = 0;
    following: any[] = [];
    followingId: any[] = [];
    followingCount: number = 0
    followingCountId: number = 0
    followingUser: Follower | null = null;
    posts: any[] = []; 
    comment: any[] = [];
    postCount: number = 0
    idClick: number | null = null;
    resultatsFiltres: Utilisateur[] = [];
    recherche: string = '';
    userId: string = "";
    utilisateurConnecteId: number | null = null;
    
    ngOnInit() {
      
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) {
        this.router.navigate(['/connexion']);
        return;
      }

      const user = JSON.parse(userString);
      this.utilisateurConnecteId = user.id || user._id;

      this.route.paramMap.subscribe(params => {
        const userId = params.get('id');
        if (userId) {
          const id = parseInt(userId, 10);
          this.chargerProfil(id);
        }
      });

      const abonneId = this.route.snapshot.params['id'];
      this.idClick = abonneId ? parseInt(abonneId, 10) : null;

      if (this.idClick && this.utilisateurConnecteId !== this.idClick) {
        this.httpTestService.isAlreadyFollowing(this.idClick).subscribe({
          next: (res) => {
            this.isFollowed = res.isFollowing;
          },
          error: () => {
            this.isFollowed = false;
          }
        });
      }

      if (this.idClick) {
        this.httpTestService.getUserById(this.idClick).subscribe(user => {
          this.utilisateurClicke = user;
        });

        this.httpTestService.getPostsByUser(this.idClick).subscribe(posts => {
          this.posts = posts;
        });
      }


          //FOLLOWING ET FOLLOWER DE L'UTILISATEUR CO

          this.httpTestService.getFollowing().subscribe(following => {
            this.following = following;
            this.followingCount = following.length;
          });
          // Récupérer la liste des abonnés
          this.httpTestService.getFollower().subscribe(follower => {
            this.follower = follower
            this.followerCount = follower.length;
            console.log("Liste abonnés", this.follower)
            console.log("Nombre abonnés:", this.followerCount)
          })
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
          //Joindre les id des utilisateurs avec les user_id des abonnés
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

          //FOLLOWING ET FOLLOWER DE L'UTILISATEUR CLICKE//
          // Récupérer la liste des abonnements
          this.httpTestService.getFollowingById(this.idClick!).subscribe(followingId => {
            this.followingId = followingId;
            this.followingCountId = followingId.length;
          });
          
          // Récupérer la liste des abonnés
          this.httpTestService.getFollowerById(this.idClick!).subscribe(followerId => {
            this.followerId = followerId;
            this.followerCountId = followerId.length;
          });
          
  
          // Joindre les id des utilisateurs avec les user_id des abonnements
          forkJoin({
            followingJoin: this.httpTestService.getFollowingById(this.idClick!),
            usersJoin: this.httpTestService.getUser()
          }).subscribe(({ followingJoin, usersJoin }) => {
            this.followingId = followingJoin;
            this.pseudo = usersJoin;
            this.followingId = this.followingId.map(f => {
              const user = this.pseudo.find(u => u.id === f.abonne_id);
              return {
                ...f,
                utilisateur: user
              };
            });
            console.log("Liste abonnements enrichis", this.followingId);
          });

          forkJoin({
            followerJoin: this.httpTestService.getFollowerById(this.idClick!),
            usersJoin: this.httpTestService.getUser()
          }).subscribe(({ followerJoin, usersJoin }) => {
            this.followerId = followerJoin;
            this.pseudo = usersJoin;
            this.followerId = this.followerId.map(f => {
              const user = this.pseudo.find(u => u.id === f.abonne_id);
              return {
                ...f,
                utilisateur: user
              };
            });
            console.log("Liste abonnements enrichis", this.followerId);
          });
  
          this.httpTestService.getUser().subscribe((data: Utilisateur[]) => {
          this.pseudo = data;
          this.resultatsFiltres = data; // initialisation
        });
          
    }

    createComment(postId: number, commentaire: string): void {
      const commentBody = { comment: commentaire };
    
      this.httpTestService.postComment(postId, commentBody).subscribe({
        next: (response) => {
          console.log("Commentaire créé :", response, "Post ID :", postId);
          
          // Vider uniquement le champ de commentaire du bon post
          this.posts = this.posts.map(p =>
            p.id === postId
              ? { ...p, commentaireTemporaire: '' }
              : p
          );
    
          // Optionnel : recharger les commentaires (sans reload)
          // this.reloadCommentaires(postId); 
        },
        error: (error) => {
          console.error("Erreur création commentaire :", error);
          alert("Le commentaire est requis.");
        }
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
    deleteComment(comment_id: any) {
      if (confirm('Es-tu sûr de vouloir supprimer ce commentaire ?')) {
        this.httpTestService.deleteComment(comment_id).subscribe({
          next: (response) => {
            console.log("Commentaire supprimé :", response);
            window.location.reload();
          },
          error: (error) => {
            console.error("Erreur suppression commentaire :", error);
          }
        });
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

    boutonCreatePost() {
      const post = document.querySelector('.createPost') as HTMLElement;
      post.style.display = 'block';
    }
  
    boutonCroixPost() {
      const post = document.querySelector('.createPost') as HTMLElement;
      post.style.display = 'none';
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

   ouvrirProfil(id: number) {
    this.router.navigate(['/profil', id]);
    if (id === undefined) {
      console.error("L'ID de l'utilisateur est indéfini.");
    }
  }

  followUser(id: number) {
    this.httpTestService.postFollow(id).subscribe({
      next: (response) => {
        console.log("Abonnement réussi :", response);
        window.location.reload();
        this.isFollowed = true; 
      },
      error: (error) => {
        console.error("Erreur d'abonnement :", error);
        alert("Une erreur s'est produite lors de l'abonnement.");
      }
    });
  }

  unfollowUser(id: number) {
    this.httpTestService.deleteFollow(id).subscribe({
      next: (response) => {
        window.location.reload();
        this.isFollowed = false; 
      },
      error: (error) => {
        console.error("Erreur d'abonnement :", error);
        alert("Une erreur s'est produite lors de l'abonnement.");
      }
    });
  }



   chargerProfil(id: number): void {
    this.httpTestService.getUserById(id).subscribe(user => {
      this.utilisateurClicke = user;
    });
  
    this.httpTestService.getPostsByUser(id).subscribe(posts => {
      this.posts = posts;
      this.postCount = posts.length;
    });
  
    this.httpTestService.getFollowing().subscribe(following => {
      this.following = following;
      this.followingCount = following.length;
    });
    // Récupérer la liste des abonnés
    this.httpTestService.getFollower().subscribe(follower => {
      this.follower = follower
      this.followerCount = follower.length;
      console.log("Liste abonnés", this.follower)
      console.log("Nombre abonnés:", this.followerCount)
    })
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
    //Joindre les id des utilisateurs avec les user_id des abonnés
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

    //FOLLOWING ET FOLLOWER DE L'UTILISATEUR CLICKE//
    // Récupérer la liste des abonnements
    this.httpTestService.getFollowingById(this.idClick!).subscribe(followingId => {
      this.followingId = followingId;
      this.followingCountId = followingId.length;
    });
    
    // Récupérer la liste des abonnés
    this.httpTestService.getFollowerById(this.idClick!).subscribe(followerId => {
      this.followerId = followerId;
      this.followerCountId = followerId.length;
    });
    

    // Joindre les id des utilisateurs avec les user_id des abonnements
    forkJoin({
      followingJoin: this.httpTestService.getFollowingById(this.idClick!),
      usersJoin: this.httpTestService.getUser()
    }).subscribe(({ followingJoin, usersJoin }) => {
      this.followingId = followingJoin;
      this.pseudo = usersJoin;
      this.followingId = this.followingId.map(f => {
        const user = this.pseudo.find(u => u.id === f.abonne_id);
        return {
          ...f,
          utilisateur: user
        };
      });
      console.log("Liste abonnements enrichis", this.followingId);
    });

    forkJoin({
      followerJoin: this.httpTestService.getFollowerById(this.idClick!),
      usersJoin: this.httpTestService.getUser()
    }).subscribe(({ followerJoin, usersJoin }) => {
      this.followerId = followerJoin;
      this.pseudo = usersJoin;
      this.followerId = this.followerId.map(f => {
        const user = this.pseudo.find(u => u.id === f.abonne_id);
        return {
          ...f,
          utilisateur: user
        };
      });
      console.log("Liste abonnements enrichis", this.followerId);
    });

    this.httpTestService.getUser().subscribe((data: Utilisateur[]) => {
    this.pseudo = data;
    this.resultatsFiltres = data; // initialisation
  });
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
