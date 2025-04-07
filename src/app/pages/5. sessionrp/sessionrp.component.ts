import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sessionrp',
  imports: [CommonModule, FormsModule],
  templateUrl: './sessionrp.component.html',
  styleUrl: './sessionrp.component.css'
})
export class SessionrpComponent {
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
