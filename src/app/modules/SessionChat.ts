import { Utilisateur } from "./User";

export interface SessionChat {
    id?: any;
    user_id: number;
    sendUser_id: number;
}

export interface SessionAvecUtilisateur extends SessionChat {
    utilisateur: Utilisateur
    destinataire: Utilisateur;
}