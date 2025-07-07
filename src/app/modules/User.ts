export interface Utilisateur {
  id?: any;
  god_id: number;
  avatar?: string;
  pseudo: string;
  email: string;
  actif: 'Actif' | 'Banni';
  etat: 'Connecté' | 'Déconnecté';
  role: 'Utilisateur' | 'Admin';
  abonnement: 'Abonné' | 'Non abonné';
  hashedPassword?: string; // souvent non renvoyé côté front
  createdAt?: Date;
  updatedAt?: Date;
}
