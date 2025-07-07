import { Component } from '@angular/core';
import { God } from '../../modules/Dieux';
import { Utilisateur } from '../../modules/User';
import { Router } from '@angular/router';
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-inscription',
  imports: [FormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  selectedGod: God | null = null;
  pseudo: string = "";
  email: string = "";
  password: string = "";
  pseudoList: Utilisateur[] = [];
  godsList: God[] = [];
  god = new Array<God>();
  resultatsFiltres: God[] = [];
  
  recherche: string = '';

  constructor(private router: Router, private httpTestService: ApiService) { }

  ngOnInit() {
   
    this.httpTestService.getGods().subscribe(gods => {
      this.godsList = gods;
      this.resultatsFiltres = gods; 
      
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
          else {
            alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            return;
          }
        }
      }); 
    }
    
    appliquerFiltres(): void {
      let result = this.godsList;
    
      // Filtre recherche
      const term = this.recherche?.toLowerCase().trim() || '';
      if (term) {
        result = result.filter(god =>
          god.nom.toLowerCase().startsWith(term)
        );
      }
      this.resultatsFiltres = result;
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

    clickConnexion() {
      this.router.navigate(['/connexion']);
    }
}
