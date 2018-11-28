export {}

// import * as uuid from 'uuid/v4';
// import { Timing, Versioned } from '../globals';
// import { Site } from '../sites/state';

// export const createEmptyTiming = (): Timing => ({
//     updatedAt: new Date().getTime(),
//     lastVisitAt: new Date().getTime(),
//     deletedAt: null
// });

// export const createVersionedValue = <T>(value: T):Versioned<T> => ({
//     timing: createEmptyTiming(),
//     value
// });

// export const createEmptySite = ():Site => ({
//     ...createEmptyTiming(),
//     id: uuid(),
//     name: '',
//     website: '',
//     username: createVersionedValue(''),
//     password: createVersionedValue(''),
//     notes: createVersionedValue('')
// });

// export function mergeDatabase(local: PasswordsState, remote: PasswordsState): PasswordsState {
//     return {
//         sites: mergeSites(local.sites, remote.sites),
//         // notes: mergeSecrets(local.notes, remote.notes)
//     }
// }

// function mergeSites(local: Site[], remote: Site[]) {
//     const ret = [
//         ...local
//     ];
//     remote.forEach(rSite => {
//         const lSite = ret.find(s => s.id === rSite.id);
//         if(!lSite) {
//             ret.push(rSite);
//             return;
//         }
//         mergeSite(lSite, rSite);
//     });
//     return ret;
// }
// function mergeSite(local: Site, remote: Site):void {
//     // We have to check this before the following loop, else `updatedAt` may get changed!
//     const hasToUpdate = local.updatedAt <= remote.updatedAt;

//     Object.keys(remote).forEach((key: keyof Site) => {
//         if(key === 'credentials') {
//             local[key] = mergeSecret(local[key], remote[key]);
//         }else if(key === 'secrets') {
//             local[key] = mergeSecrets(local[key], remote[key]);
//         }else if(hasToUpdate) {
//             local[key] = remote[key];
//         }
//     });
// }

// function mergeSecret<T extends Secret>(local: T, remote: T): T {
//     if(local.updatedAt > remote.updatedAt) {
//         return local;
//     }
//     return remote;
// }

// function secretIsNote(s: Secret): s is Note {
//     return !!(s as any).id;
// }
// function mergeSecrets<T extends Secret>(local: T[], remote: T[]): T[] {
//     const ret = [...local];
//     remote.forEach(rSecret => {
//         const iSecret = secretIsNote(rSecret) ? ret.findIndex((s: any) => s.id === rSecret.id) : ret.findIndex(s => s.name === rSecret.name);
//         if(iSecret < 0) {
//             ret.push(rSecret);
//             return;
//         }
//         ret[iSecret] = mergeSecret(ret[iSecret], rSecret);
//     });
//     return ret;
// }
