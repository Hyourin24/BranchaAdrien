import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fil',
  imports: [CommonModule, FormsModule],
  templateUrl: './fil.component.html',
  styleUrl: './fil.component.css'
})
export class FilComponent {
  constructor (private router: Router, private httpTestService: ApiService) { }
  
  ngOnInit() {
    const token = localStorage.getItem("token");

    if (!token) {
      this.router.navigate(['/connexion']);
      return;
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
