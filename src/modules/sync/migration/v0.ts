export interface DBv0 {
  sites: Site[];
  notes: Note[];
}

interface Timing {
  createdAt: number;
  updatedAt: number;
  lastVisitAt: number;
  deletedAt: number;
}

interface Secret extends Timing {
  name: string;
  secret: string;
}

interface Note extends Secret {
  id: string;
}

export function secretIsNote(s: Secret): s is Note {
  return !!(s as any).id;
}

interface Site extends Timing {
  id: string;
  name: string;
  website: string;
  credentials: Secret;
  tags: string[];
  notes: string;
  secrets: Secret[];
}
