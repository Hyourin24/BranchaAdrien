import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../modules/User';
import { SessionAvecUtilisateur, SessionChat } from '../../modules/SessionChat';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sessionrp',
  imports: [CommonModule, FormsModule],
  templateUrl: './sessionrp.component.html',
  styleUrl: './sessionrp.component.css'
})
export class SessionrpComponent {
  utilisateur: Utilisateur | null = null;
  sessionListUser: SessionChat [] = []

  session: SessionAvecUtilisateur [] = []
  pseudo: Utilisateur [] = []
  follower: any[] = [];
  following: any[] = [];
  constructor (private router: Router, private httpTestService: ApiService) { }
    
    ngOnInit() {
      const token = localStorage.getItem("token");
  
      if (!token) {
        this.router.navigate(['/connexion']);
        return;
      }
      this.httpTestService.getMe().subscribe(utilisateur => {
        this.utilisateur = utilisateur;
        console.log("Utilisateur connecté :", this.utilisateur);
      
        if (this.utilisateur) {
          forkJoin({
            chatsessionJoin: this.httpTestService.getChatSessionsUserId(),
            userJoin: this.httpTestService.getUser()
          }).subscribe(({ chatsessionJoin, userJoin }) => {
            this.pseudo = userJoin;
      
            this.session = chatsessionJoin.map((session: { user_id: any; sendUser_id: any; }) => {
              const auteur = this.pseudo.find(u => u.id === session.user_id);
              const destinataire = this.pseudo.find(u => u.id === session.sendUser_id);
      
              return {
                ...session,
                utilisateur: auteur ? auteur : {} as Utilisateur,
                destinataire: destinataire ? destinataire : {} as Utilisateur
              };
              
            });
          });
        }
      });
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
