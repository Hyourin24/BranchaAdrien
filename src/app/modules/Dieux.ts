enum Mythologie {
    grec = 'Grec',
    romain = 'Romain',
    égyptien = 'Égyptien',
    nordique = 'Nordique',
    celte = 'Celte',
    chinois = 'Chinois',
    japonais = 'Japonais',
}

export interface God {
    id?: number;
    nom: string;
    description: string;
    mythologie: Mythologie;
    image_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

