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
