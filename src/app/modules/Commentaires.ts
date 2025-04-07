export interface CommentAttributes {
    id?: number;
    user_id: number;
    post_id: number;
    comment: string;
    date_création?: Date;
    date_modification?: Date
}