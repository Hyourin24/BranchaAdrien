import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../modules/User';
import { PostAvecAuteur, Posts } from '../../modules/Posts';
import { forkJoin } from 'rxjs';
import { God } from '../../modules/Dieux';
import { CommentAttributes, CommentAvecUser } from '../../modules/Commentaires';

@Component({
  selector: 'app-para',
  imports: [FormsModule, CommonModule],
  templateUrl: './para.component.html',
  styleUrl: './para.component.css'
})
export class ParaComponent {
  userInfo: any = JSON.parse(localStorage.getItem("userInfo") || '{}');
  userList: Utilisateur[] = [];
  utilisateur: Utilisateur = JSON.parse(localStorage.getItem("user") || '{}');
  utilisateurs: Utilisateur[] = [];
  postList: Posts[] = [];
  pseudo: Utilisateur[] = [];
  post: any = {}
  user: any = {}
  posts: PostAvecAuteur[] = [];
  godList: God [] = []
  commentList: CommentAttributes[] = []
  comment: CommentAvecUser[] = []
  following: any[] = [];

  rechercheUser: string = '';
  resultatUser: Utilisateur[] = [];

  recherchePost: string = '';
  resultatPost: PostAvecAuteur[] = [];

  rechercheGod: string = ''
  resultatGod: God[] = []

  rechercheComment: string = ''
  resultatComment: CommentAvecUser[] = []

  constructor (private router: Router, private httpTestService: ApiService) { }
      
  ngOnInit() {

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token) {
      this.router.navigate(['/connexion']);
    }
    // Récupérer l'utilisateur connecté
    this.httpTestService.getMe().subscribe(utilisateur => {
      this.utilisateur = utilisateur
      if (this.utilisateur.role !== 'Admin') {
        this.router.navigate(['/accueil']);
        return;
      }
    });
  
  
    // Maintenant que l'utilisateur est validé, on peut charger les utilisateurs
    this.httpTestService.getUser().subscribe(utilisateurs => {
      this.userList = utilisateurs;
      console.log("User List:", this.userList);
    });

    this.httpTestService.getPosts().subscribe(posts => {
      this.postList = posts;
      console.log("Post List:", this.postList);
    })

    this.httpTestService.getGods().subscribe(gods => {
      this.godList = gods;
      console.log("God list:", this.godList)
    })

    forkJoin({
      postJoin: this.httpTestService.getPosts(),
          usersJoin: this.httpTestService.getUser()
        }).subscribe(({ postJoin, usersJoin }) => {
          this.posts = postJoin;
          this.pseudo = usersJoin;
          // Filtrer les posts
          this.posts = this.posts.map(p => {
            const auteur = this.pseudo.find(u => u.id === p.user_id);
            return {
              ...p,
              utilisateur: auteur ? auteur : {} as Utilisateur // fallback to empty Utilisateur object
            };
        })
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
  }

  ouvrirProfil(id: number) {
    this.router.navigate(['/profil', id]);
    if (id === undefined) {
      console.error("L'ID de l'utilisateur est indéfini.");
    }
  }

  afficherCommentaire() {
        const idPost = this.rechercheComment.trim();

      if (!idPost) {
        this.resultatComment = [];
        return;
      }

      forkJoin({
        commentJoin: this.httpTestService.getCommentsByPost(idPost),
        usersJoin: this.httpTestService.getUser()
      }).subscribe({
        next: ({ commentJoin, usersJoin }) => {
          this.resultatComment = commentJoin.map((c: { user_id: any; }) => {
            const user = usersJoin.find((u: { id: any; }) => u.id === c.user_id);
            return {
              ...c,
              utilisateurComment: user ? user : { pseudo: 'Inconnu' } as Utilisateur
            };
          });
        },
        error: err => {
          console.error("Erreur lors du chargement des commentaires :", err);
          this.resultatComment = [];
        }
      });
    }

  updateActiveStatus(userId: string) {
    const confirmation = confirm('Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?');
    if (!confirmation) return;

    this.httpTestService.updateActiveUser(userId).subscribe({
      next: (res) => {
        const user = this.resultatUser.find(user => String(user.id) === userId);
        if (user) {
          user.actif = user.actif === "Actif" ? "Banni" : "Actif";
        }
        alert('Statut mis à jour avec succès.');
      },
      error: (err) => {
        
        alert("Impossible de mettre à jour le statut de l'utilisateur.");
      }
    });
   }


   deletePost(post_id: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce post ?");
    if (!confirmation) return;
  
    this.httpTestService.deletePost(post_id).subscribe({
      next: () => {

        this.resultatPost = this.resultatPost.filter(post => post.id !== post_id);
  
        alert("Post supprimé avec succès.");
      },
      error: () => {
        alert("Impossible de supprimer ce post.");
      }
    });
  }

   deleteGod(god_id: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce Dieu ?");
    if (!confirmation) return;

    this.httpTestService.deleteGod(god_id).subscribe({
      next: () => {
        this.resultatGod = this.resultatGod.filter(god => god.id !== god_id);
        alert("Blasphème réalisé avec succès.");
      },
      error: (err) => {
        alert("Impossible de supprimer ce Dieu.");
      }
    });
  }

  deleteComment(comment_id: string) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce Dieu ?");
    if (!confirmation) return;

    this.httpTestService.deleteComment(comment_id).subscribe({
      next: () => {
        this.commentList = this.commentList.filter(comment => comment.id !== comment_id);
        alert("Commentaire supprimé avec succès.");
      },
      error: (err) => {
        alert("Impossible de supprimer ce commentaire.");
      }
    });
  }
  rechercheResultUser(): void {
    const term = this.rechercheUser?.toLowerCase().trim() || '';
    this.resultatUser = this.userList.filter(user =>
      user.pseudo && user.pseudo.toLowerCase().startsWith(term)
    );
  }

  rechercheResultComment(): void {
    const term = this.rechercheComment?.toLowerCase().trim() || '';
    this.resultatComment = this.commentList
    .filter(comment => comment.post_id)
    .map (comment => {
      const auteur = this.pseudo.find(u => u.id === comment.user_id)
      return {
        ...comment,
        utilisateurComment: auteur ? auteur : {} as Utilisateur 
      }
    })
  }
  

  rechercheResultPost(): void {
    const term = this.recherchePost?.toLowerCase().trim() || '';
    this.resultatPost = this.postList
      .filter(post => post.titre && post.titre.toLowerCase().startsWith(term))
      .map(post => {
        const auteur = this.pseudo.find(u => u.id === post.user_id);
        return {
          ...post,
          utilisateur: auteur ? auteur : {} as Utilisateur // fallback to empty Utilisateur object
        };
      });
  }

  rechercheResultGod(): void {
    const term = this.rechercheGod?.toLowerCase().trim() || '';
    this.resultatGod = this.godList.filter(god =>
      god.nom && god.nom.toLowerCase().startsWith(term)
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
