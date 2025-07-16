import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Utilisateur } from '../../modules/User';
import { ApiService } from '../../services/api.service';
import { God } from '../../modules/Dieux';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  // --------------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------Partie Back------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------

  pseudo: string = "";
  email: string = "";
  password: string = "";
  pseudoList: Utilisateur[] = [];
  godsList: God[] = [];
  god = new Array<God>();
  selectedGodId: number | null = null;

  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
    this.httpTestService.getUser().subscribe(pseudo => {
      this.pseudoList = pseudo;
    });
  }

  login() {
    const authBody = { pseudo: this.pseudo, password: this.password };

    this.httpTestService.connexion(authBody).subscribe({
      next: response => {
        const user = response.user;

        if (user.actif === 'Banni') {
          alert("Votre compte a été banni. Veuillez contacter un administrateur.");
          return;
        }
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/accueil']);
      },
      error: () => {
        alert('Pseudo ou mot de passe invalide');
        
      }
    });
  }

  

  // --------------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------Partie Routes----------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------

  buttonInscription() {
    const connexion = document.querySelector('.connexion') as HTMLElement;
    const inscription = document.querySelector('.inscription') as HTMLElement;

    if (connexion) {
        connexion.style.display= 'none'; // Cache la connexion immédiatement
    }

    if (inscription) {
      inscription.style.display = 'block';
      setTimeout(() => {
          inscription.style.opacity = '1';
          inscription.classList.add('show');
      }, 10); 
    }
  }

  clickInscription() {
    this.router.navigate(['/inscription']);
  }
}
