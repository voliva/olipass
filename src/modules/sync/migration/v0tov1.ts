import { DBv0 } from "./v0";
import { DB } from "src/services/encryptedDB";

export const v0tov1 = (db0: DBv0): DB => ({
  sites: db0.sites.map((site) => ({
    id: site.id,
    name: site.name ? site.name : undefined,
    website: site.website ? site.website : undefined,
    username: site.credentials.name ? site.credentials.name : undefined,
    password: site.credentials.secret ? site.credentials.secret : undefined,
    notes: site.notes ? site.notes : undefined,
    updatedAt: new Date(site.updatedAt),
    lastVisitAt: site.deletedAt ? new Date(site.lastVisitAt) : undefined,
    deletedAt: site.deletedAt ? new Date(site.deletedAt) : undefined,
    usernameUpdtAt: new Date(site.credentials.updatedAt),
    passwordUpdtAt: new Date(site.credentials.updatedAt),
    notesUpdtAt: new Date(site.updatedAt),
  })),
  version: 1,
});
