export interface Timing {
    createdAt: number;
    updatedAt: number;
    lastVisitAt: number;
    deletedAt: number | null;
}
export interface Secret extends Timing {
    name: string;
    secret: string;
}
export interface Note extends Secret {
    id: string;
}
export interface Site extends Timing {
    id: string;
    name: string;
    website: string;
    credentials: Secret;
    tags: string[];
    notes: string;
    secrets: Secret[];
}

export interface PasswordsState {
    sites: Site[];
    notes: Note[];
}
