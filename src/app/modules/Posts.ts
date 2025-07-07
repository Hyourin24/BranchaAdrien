import { Utilisateur } from "./User";

export interface Posts {
    id?: any;
    user_id: number;
    titre: string;
    post: string;
    date_creation?: Date;
    date_modification?: Date;
}

export interface PostAvecAuteur extends Posts {
    utilisateur: Utilisateur; // ou { pseudo: string, avatar?: string } si tu veux faire simple
  }
  