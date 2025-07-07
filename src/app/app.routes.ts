import { Routes } from '@angular/router';
import { AuthComponent } from './pages/1. connexion/auth.component';
import { AccueilComponent } from './pages/3. accueil/accueil.component';
import { FilComponent } from './pages/4. fil/fil.component';
import { SessionrpComponent } from './pages/5. sessionrp/sessionrp.component';
import { GestionCompteComponent } from './pages/6. gestion-compte/gestion-compte.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ParaComponent } from './pages/7. dashboard/para.component';
import { InscriptionComponent } from './pages/2. inscription/inscription.component';
import { ProfilIdComponent } from './pages/8. profil-id/profil-id.component';

export const routes: Routes = [{
    path: '',
    redirectTo: "connexion",
    pathMatch: 'full'

},{
    path: "connexion",
    component: AuthComponent
},{
    path: "inscription",
    component: InscriptionComponent
},{
    path: "accueil",
    component: AccueilComponent
},{
    path: "fil",
    component: FilComponent
}, { 
    path: 'profil/:id', 
    component: ProfilIdComponent
},{
    path: "session",
    component: SessionrpComponent
},{
    path: "gestion",
    component: GestionCompteComponent
},{
    path: "setting",
    component: ParaComponent
},{
    path: "**",
    component: NotFoundComponent
}];