import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Follower } from '../../modules/Follower';
import { Utilisateur } from '../../modules/User';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

  follower: string = "";
  followersList: Follower[] = [];
  pseudo: string = "";
  password: string = "";

  constructor (private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.router.navigate(['/connexion']);
      return;
    }

    this.httpTestService.getFollowing().subscribe(followers => {
      this.followersList = followers;
      console.log(this.followersList);
    })
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
    this.router.navigate(['/gestion']);
  }

  pageDeconnexion() {
    localStorage.removeItem('token');
    this.router.navigate(['/connexion']);
  }
}
