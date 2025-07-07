import { Utilisateur } from "./User";

export interface CommentAttributes {
    id?: any;
    user_id: number;
    post_id: number;
    comment: string;
    date_creation?: Date;
    date_modification?: Date
}

export interface CommentAvecUser extends CommentAttributes {
    utilisateurComment: Utilisateur
}