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
  
  //Création des paramètres en fonction des models
  nouveauPost: { titre: string, post: string } = { titre: '', post: '' };
  post: Posts | undefined;

  pseudo: Utilisateur[] = []
  email: string = "";
  password: string = "";
  pseudoList: Utilisateur[] = [];

  utilisateur: Utilisateur | undefined
  follower: any[] = [];
  followerCount: any [] = [];
  following: any[] = [];
  followingCount: number = 0
  followingUser: Follower | null = null;
  posts: any[] = []; 
  comment: string = ""
  postCount: number = 0
  postId: string = "";
  popupVisible: boolean = false;
    
  ngOnInit() {
  

  
  const token = localStorage.getItem("token");
  if (!token) {
    this.router.navigate(['/connexion']);
    return;
  }

  // Récupérer l'utilisateur connecté
  this.httpTestService.getMe().subscribe(utilisateur => {
    this.utilisateur = utilisateur;
    console.log("Utilisateur connecté :", this.utilisateur);

    // Maintenant que this.utilisateur.id est bien défini, on peut appeler forkJoin
    forkJoin({
      postsJoin: this.httpTestService.getPostsByUser(this.utilisateur?.id),
      usersJoin: this.httpTestService.getUser()
    }).subscribe(({ postsJoin, usersJoin }) => {
      this.posts = postsJoin;
      this.pseudo = usersJoin;
      this.postCount = this.posts.length;

      this.posts = this.posts.map(p => ({
        ...p,
        isCommentsVisible: false,
        commentaireTemporaire: ''
      }));
      console.log("Liste posts enrichis", this.posts);
    });
  });
    this.httpTestService.getFollowing().subscribe(following => {
      this.following = following;
      this.followingCount = following.length;
      console.log("Liste abonnement", this.following)
      console.log("Nombre abonnement:", this.followingCount)
    });
    this.httpTestService.getFollower().subscribe(follower => {
      this.follower = follower
      this.followerCount = follower.length;
      console.log("Liste abonnés", this.follower)
      console.log("Nombre abonnés:", this.followerCount)
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
    //Joindre les id des utilisateurs avec les user_id des posts
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------
  selectedAvatarFile: File | null = null;
  onAvatarSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      this.selectedAvatarFile = fileInput.files[0];
      console.log("Avatar sélectionné :", this.selectedAvatarFile);
    }
  }
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  async modifyUser() {
    let avatarBase64 = null;
    if (this.selectedAvatarFile) {
      avatarBase64 = await this.convertFileToBase64(this.selectedAvatarFile);
    }
    const modifyBody = {
      pseudo: this.utilisateur?.pseudo,
      password: this.password,
      avatar: avatarBase64
    };
    this.httpTestService.putUser(modifyBody).subscribe({
      next: (response) => {
        console.log("Modification réussie :", response);
        this.utilisateur = response.utilisateur;
        this.password = '';
        this.selectedAvatarFile = null;
        window.location.reload();
      },
      error: (error) => {
        console.error("Erreur modification :", error);
      }
    });
  }
  // Récupérer les posts des users

  getPostsByUser(user_id: any) {
    this.httpTestService.getPostsByUser(user_id).subscribe(posts => {
      this.posts = posts;
      console.log("Posts de l'utilisateur :", this.posts);
    });
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
  supprimerPost(post_id: any) {
    if (confirm('Es-tu sûr de vouloir supprimer ce post ?')) {
      this.httpTestService.deletePost(post_id).subscribe(() => {
        window.location.reload();
      });
    }
  }
  deleteComment(comment_id: any) {
    if (confirm('Es-tu sûr de vouloir supprimer ce commentaire ?')) {
      this.httpTestService.deleteComment(comment_id).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error("Erreur suppression commentaire :", error);
        }
      });
    }
  }
  modifyPost(post_id: any) {
    const modifyBody = {
      titre: this.nouveauPost.titre, // 🧠 Nouveau texte tapé
      post: this.nouveauPost.post
    };

    this.httpTestService.modifyPost(post_id, modifyBody).subscribe({
      next: (response) => {
        console.log("Modification réussie :", response);
        window.location.reload();
      },
      error: (error) => {
        console.error("Erreur modification :", error);
      }
    });
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
  
  
  ouvrirProfil(id: number) {
    this.router.navigate(['/profil', id]);
    if (id === undefined) {
      console.error("L'ID de l'utilisateur est indéfini.");
    }
  }

  boutonCreatePost() {
    const post = document.querySelector('.createPost') as HTMLElement;
    post.style.display = 'block';
    this.popupVisible = true; 
  }

  boutonCroixPost() {
    const post = document.querySelector('.createPost') as HTMLElement;
    post.style.display = 'none';
    this.popupVisible = false; 
  }

  boutonCreateComment() {
    const comment = document.querySelector('.createComment') as HTMLElement;
    comment.style.display = 'block';
    console.log("Bouton pour créer un commentaire cliqué");
  }

  boutonCroixComment() {
    const comment = document.querySelector('.createComment') as HTMLElement;
    comment.style.display = 'none';
  }
  
  
  afficherModify(post_id: any) {
    const modify = document.querySelector('.modifyPost') as HTMLElement;
    modify.style.display = 'block';
    this.popupVisible = true;
    const post = this.posts.find(p => p.id === post_id);
    if (post) {
      this.nouveauPost.titre = post.titre;
      this.nouveauPost.post = post.post;
    }
  }
  boutonCroixModify() {
    const modify = document.querySelector('.modifyPost') as HTMLElement;
    modify.style.display = 'none';
    this.popupVisible = false; 
  }
  
  boutonModifyProfil() {
    const edit = document.querySelector('.editProfil') as HTMLElement;
    edit.style.display = 'block';
    this.popupVisible = true; 
  }
  boutonCroixModifyProfil() {
    const edit = document.querySelector('.editProfil') as HTMLElement;
    edit.style.display = 'none';
    this.popupVisible = false;
  }

  boutonAbonnement() {
    const abonnement = document.querySelector('.listeAbonnements') as HTMLElement;
    abonnement.style.display = 'block';
    this.popupVisible = true; 
  }

  boutonCroixAbonnement() {
    const abonnement = document.querySelector('.listeAbonnements') as HTMLElement;
    abonnement.style.display = 'none';
    this.popupVisible = false; 
  }

  boutonAbonnes() {
    const abonnés = document.querySelector('.listeAbonnes') as HTMLElement;
    abonnés.style.display = 'block';
    this.popupVisible = true; 
  }

  boutonCroixAbonnes() {
    const abonnement = document.querySelector('.listeAbonnes') as HTMLElement;
    abonnement.style.display = 'none';
    this.popupVisible = false; 
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
