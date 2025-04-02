import { Routes } from '@angular/router';
import { AuthComponent } from './pages/1. connexion/auth.component';
import { AccueilComponent } from './pages/3. accueil/accueil.component';
import { FilComponent } from './pages/4. fil/fil.component';
import { SessionrpComponent } from './pages/5. sessionrp/sessionrp.component';
import { GestionCompteComponent } from './pages/6. gestion-compte/gestion-compte.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [{
    path: '',
    redirectTo: "connexion",
    pathMatch: 'full'

},{
    path: "connexion",
    component: AuthComponent
},{
    path: "accueil",
    component: AccueilComponent
},{
    path: "fil",
    component: FilComponent
},{
    path: "session",
    component: SessionrpComponent
},{
    path: "gestion",
    component: GestionCompteComponent
},{
    path: "**",
    component: NotFoundComponent
}];