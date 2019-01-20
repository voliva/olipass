import { Site } from "../sites/state";

interface Timing_v0 {
    createdAt: number;
    updatedAt: number;
    lastVisitAt: number;
    deletedAt: number;
}
interface Secret_v0 extends Timing_v0 {
    name: string;
    secret: string;
}
interface Site_v0 extends Timing_v0 {
    id: string;
    name: string;
    website: string;
    credentials: Secret_v0;
    tags: string[];
    notes: string;
    secrets: Secret_v0[];
}

export interface SOWDatabase_v0 {
    sites: Site_v0[];
}
export interface SOWDatabase {
    version: number;
    sites: Site[];
}

export function fromStoreToSync(state: Site[]): SOWDatabase {
    return {
        version: 1,
        sites: state
    }
}
export function getSyncVersion() {
    
}
