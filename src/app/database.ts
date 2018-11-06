import * as uuid from 'uuid/v4';

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
export interface Note extends Secret {
    id: string;
}
function secretIsNote(s: Secret): s is Note {
    return !!(s as any).id;
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

export interface SOWDatabase {
    sites: Site[];
    notes: Note[];
}

export const createEmptyTiming = ():Timing => ({
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    lastVisitAt: new Date().getTime(),
    deletedAt: null
});

export const createEmptySecret = ():Secret => ({
    ...createEmptyTiming(),
    name: '',
    secret: ''
});

export const createEmptySite = ():Site => ({
    ...createEmptyTiming(),
    id: uuid(),
    name: '',
    website: '',
    credentials: createEmptySecret(),
    tags: [],
    notes: '',
    secrets: []
});

// function getMaxDate(base: number, tm: Timing) {
//     return [tm.createdAt, tm.deletedAt, tm.lastVisitAt, tm.updatedAt]
//         .filter(t => !!t)
//         .reduce((max, v) => Math.max(max, v), base);
// }
// function lastSOWUpdate(db: SOWDatabase) {
//     const maxSiteDate = db.sites.reduce(getMaxDate, 0);
//     const maxNotesDate = db.notes.reduce(getMaxDate, 0);
//     return Math.max(maxSiteDate, maxNotesDate);
// }

function mergeSites(local: Site[], remote: Site[]) {
    const ret = [
        ...local
    ];
    remote.forEach(rSite => {
        const lSite = ret.find(s => s.id === rSite.id);
        if(!lSite) {
            ret.push(rSite);
            return;
        }
        mergeSite(lSite, rSite);
    });
    return ret;
}

// Mutates local site
function mergeSite(local: Site, remote: Site):void {
    // We have to check this before the following loop, else `updatedAt` may get changed!
    const hasToUpdate = local.updatedAt <= remote.updatedAt;

    Object.keys(remote).forEach((key: keyof Site) => {
        if(key === 'credentials') {
            local[key] = mergeSecret(local[key], remote[key]);
        }else if(key === 'secrets') {
            local[key] = mergeSecrets(local[key], remote[key]);
        }else if(hasToUpdate) {
            local[key] = remote[key];
        }
    });
}

function mergeSecret<T extends Secret>(local: T, remote: T): T {
    if(local.updatedAt > remote.updatedAt) {
        return local;
    }
    return remote;
}

function mergeSecrets<T extends Secret>(local: T[], remote: T[]): T[] {
    const ret = [...local];
    remote.forEach(rSecret => {
        const iSecret = secretIsNote(rSecret) ? ret.findIndex((s: any) => s.id === rSecret.id) : ret.findIndex(s => s.name === rSecret.name);
        if(iSecret < 0) {
            ret.push(rSecret);
            return;
        }
        ret[iSecret] = mergeSecret(ret[iSecret], rSecret);
    });
    return ret;
}

export function mergeDatabase(local: SOWDatabase, remote: SOWDatabase): SOWDatabase {
    return {
        sites: mergeSites(local.sites, remote.sites),
        notes: mergeSecrets(local.notes, remote.notes)
    }
}

