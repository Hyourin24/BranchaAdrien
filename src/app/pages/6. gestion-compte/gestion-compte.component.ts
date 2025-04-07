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
  pseudo: Utilisateur[] = []
  email: string = "";
  password: string = "";
  pseudoList: Utilisateur[] = [];

  utilisateur: Utilisateur | null = null;
  follower: any[] = [];
  followerCount: any [] = [];
  following: any[] = [];
  followingCount: number = 0
  followingUser: Follower | null = null;
  posts: any[] = []; 
  postCount: number = 0
    
  ngOnInit() {
    const token = localStorage.getItem("token");
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
    this.httpTestService.getFollower().subscribe(follower => {
      this.follower = follower
      this.followerCount = follower.length;
      console.log("Liste abonnés", this.follower)
      console.log("Nombre abonnés:", this.followerCount)
    })
    // Récupérer la liste des posts
    this.httpTestService.getPostsMe().subscribe(posts => {
      this.posts = posts
      this.postCount = posts.length;
      console.log("Liste post", this.posts)
      console.log("Nombre posts:", this.postCount)
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
    //Joindre les id des utilisateurs avec les user_id des posts
    forkJoin({
      postsJoin: this.httpTestService.getPostsMe(),
      usersJoin: this.httpTestService.getUser()
    }).subscribe(({ postsJoin, usersJoin }) => {
      this.posts = postsJoin;
      this.pseudo = usersJoin;
      this.posts = this.posts.map(p => {
        return {
          ...p,
          isCommentsVisible: false,
          commentaires: p.commentaires.map((c: { user_id: number | undefined; }) => {
            const user = this.pseudo.find(u => u.id === c.user_id);
            return {
              ...c,
              pseudo: user?.pseudo || 'Utilisateur inconnu'
            };
          })
        };
      });
      console.log("Liste posts enrichis", this.posts);
    });
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
      avatar: avatarBase64 // <- ajoute l'image si elle existe
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
  supprimerPost(post_id: any) {
  if (confirm('Es-tu sûr de vouloir supprimer ce post ?')) {
    this.httpTestService.deletePost(post_id).subscribe(() => {
      window.location.reload();
    });
  }
}
  
  
  
  boutonModifyProfil() {
    const edit = document.querySelector('.editProfil') as HTMLElement;
    edit.style.display = 'block';
  }
  boutonCroixModifyProfil() {
    const edit = document.querySelector('.editProfil') as HTMLElement;
    edit.style.display = 'none';
  }
  boutonCommentaires(post: any) {
    post.isCommentsVisible = !post.isCommentsVisible;
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
