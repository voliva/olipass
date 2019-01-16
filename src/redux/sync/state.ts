import { Site } from "../sites/state";

export type PasswordDB = {
    sites: Site[]
}

export interface SyncState {
    promptImportPsw: boolean
}
