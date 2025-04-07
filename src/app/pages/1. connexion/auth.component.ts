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
      console.log(this.pseudoList);
    });
    this.httpTestService.getGods().subscribe(gods => {
      this.godsList = gods;
      
      //Récupération des noms, image et description
      console.log(this.godsList);
      this.godsList.forEach(god => {
        return {
          id: god.id,
          nom: god.nom,
          description: god.description,
          mythologie: god.mythologie,
          image_url: god.image_url
        }
      });

    });
  }

  login() {
    const authBody = { pseudo: this.pseudo, password: this.password };

    this.httpTestService.connexion(authBody).subscribe({
      next: response => {
        localStorage.setItem('token', response.token); 
        this.router.navigate(['/accueil']);
      },
      error: () => {
        alert('Pseudo ou mot de passe invalide');
      }
    });
  }

  selectedGod: God | null = null;

  selectGod(god: God): void {
    this.selectedGod = god;
  }

  inscription () {
    const inscriptionBody = { pseudo: this.pseudo, email: this.email, password: this.password, god_id: this.selectedGod?.id };
    console.log("Body envoyé :", inscriptionBody);

    this.httpTestService.inscription(inscriptionBody).subscribe({
      next: response => {
        console.log("DEBUG - Réponse du backend :", response);
      },
      error: (err) => {
        if (!this.pseudo || !this.email || !this.password || !this.selectedGod?.id) {
          alert("Veuillez remplir tous les champs et choisir un dieu.");
        return;
}
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

  buttonChoix() {
    const choixDieux = document.querySelector('.choix') as HTMLElement;
    const inscription = document.querySelector('.inscription') as HTMLElement;
    const tri = document.querySelector('.tri') as HTMLElement;

    if (inscription) {
        inscription.style.display = 'none'; // Cache la connexion immédiatement
    }

    if (inscription) {
      choixDieux.style.display = 'block';
      tri.classList.add('none');
      setTimeout(() => {
          choixDieux.style.opacity = '1';
          choixDieux.classList.add('show');
      }, 10); 
    }
  }

  boutonTri() {
    const buttonFiltre = document.querySelector('.buttonFiltre') as HTMLElement;
    const tri = document.querySelector('.tri') as HTMLElement;
    if (buttonFiltre) {
        tri.classList.toggle('none'); // Cache la connexion immédiatement
    }
  }

  boutonFormulaireInscription() {
    const form = document.querySelector('.formulaireInscription') as HTMLElement;
    const choixDieux = document.querySelector('.choix') as HTMLElement;
    
    if (choixDieux) {
        choixDieux.style.display = 'none'; // Cache la connexion immédiatement
    }

    if (choixDieux) {
      form.style.display = 'block';
      console.log(this.selectedGod)
      }
    }

  boutonFinalisation() {
    const form = document.querySelector('.formulaireInscription') as HTMLElement;
    const finalisation = document.querySelector('.finalisation') as HTMLElement;

    if (form) {
        form.style.display = 'none'; // Cache la connexion immédiatement
    }

    if (form) {
      finalisation.style.display = 'block';
      setTimeout(() => {
          finalisation.style.opacity = '1';
          finalisation.classList.add('show');
      }, 10); 
    }
  }
}
