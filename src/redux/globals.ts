import isNil from "ramda/es/isNil";
import mapObjIndexed from "ramda/es/mapObjIndexed";
import reduce from "ramda/es/reduce";

export type Normalized<T> = T extends (infer R)[] ? {
    byId: {
        [key: string]: R
    },
    allIds: string[]
} : never;

export const normalize: (<T extends {id: string}>(values: T[]) => Normalized<T[]>) =
    reduce<any, Normalized<any[]>>((acc, v) => ({
        byId: {
            ...acc.byId,
            [v.id]: v
        },
        allIds: [
            ...acc.allIds,
            v.id
        ]
    }), {
        byId: {},
        allIds: []
    });

export interface Timing {
    updatedAt: number;
    lastVisitAt?: number;
    deletedAt: number | null;
}
export interface Versioned<T> {
    updatedAt: number;
    value: T;
}
export type Unversioned<T> = {
    [K in keyof T]: T[K] extends Versioned<infer R> ? R : T[K]
}
export const unversion: <T>(obj: T) => Unversioned<T> =
    mapObjIndexed((value: any) => {
        if(isNil(value) || isNil(value.updatedAt) || isNil(value.value)) {
            return value;
        }
        return value.value;
    }) as any;

type Reversioned<T, K extends keyof T> = {
    [I in keyof T]: I extends K ? Versioned<T[I]> : T[I]
}

export const createReversion: <T, K extends keyof T>(example: T, ...keys: K[]) => (
    obj: T,
    updatedAt: number,
    original?: Reversioned<T, K>
) => Reversioned<T, K> =
    <T, K extends keyof T>(example: T, ...keys: K[]) =>
        (obj: T, updatedAt: number, original?: Reversioned<T, K>) => {
            const getUpdatedAt = (key: keyof T) => {
                if(!original) {
                    return updatedAt;
                }
                const originalValue = original[key] as Versioned<any>;
                if(originalValue.value !== obj[key]) {
                    return updatedAt;
                }
                return originalValue.updatedAt;
            }

            return mapObjIndexed((value: any, key: any) => {
                if(keys.indexOf(key) < 0) return value;

                return {
                    updatedAt: getUpdatedAt(key),
                    value
                };
            }, obj) as any;
        }

export const basicsHaveChanged = <T>(a: T, b: T) => (Object.keys(a) as Array<keyof T>)
    .some((key: keyof T) => {
        const typeofa = typeof a[key];
        const typeofb = typeof b[key];
        const basicTypes = ['string', 'number'];

        if(basicTypes.indexOf(typeofa) >= 0 || basicTypes.indexOf(typeofb) >= 0) {
            return a[key] !== b[key];
        }
        return false;
    });