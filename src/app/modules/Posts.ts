export interface Posts {
    id?: number;
    user_id: number;
    titre: string;
    post: string;
    date_création?: Date;
    date_modification?: Date;
}