import { Site, DB } from "./encryptedDB";

export const mergeDatabase = (localSites: Site[], database: DB) => {
  if (!Array.isArray(database.sites)) {
    throw new Error("Unknown format");
  }

  const newSites = mergeSites(localSites, database.sites);
  return {
    sites: newSites,
  };
};

const mergeSite = (local: Site, merging: any): Site => {
  const ret = {
    ...local,
  };

  if (local.updatedAt < new Date(merging.updatedAt)) {
    ret.name = merging.name;
    ret.website = merging.website;
    ret.updatedAt = new Date(merging.updatedAt);
  }

  if (local.usernameUpdtAt < new Date(merging.usernameUpdtAt)) {
    ret.username = merging.username;
    ret.usernameUpdtAt = new Date(merging.usernameUpdtAt);
  }

  if (local.passwordUpdtAt < new Date(merging.passwordUpdtAt)) {
    ret.password = merging.password;
    ret.passwordUpdtAt = new Date(merging.passwordUpdtAt);
  }

  if (local.notesUpdtAt < new Date(merging.notesUpdtAt)) {
    ret.notes = merging.notes;
    ret.notesUpdtAt = new Date(merging.notesUpdtAt);
  }

  if (merging.deletedAt) {
    ret.deletedAt = new Date(merging.deletedAt);
  }

  return ret;
};

const requiredSiteFields: Array<keyof Site> = [
  "id",
  "updatedAt",
  "usernameUpdtAt",
  "passwordUpdtAt",
  "notesUpdtAt",
];
const mergeSites = (local: Site[], merging: any[]): Site[] => {
  const result = [...local];
  merging.forEach((mergingSite) => {
    if (!requiredSiteFields.every((key) => key in mergingSite)) {
      throw new Error("missing field id in site");
    }
    const idx = result.findIndex(({ id }) => id === mergingSite.id);
    if (idx < 0) {
      result.push(mergingSite);
    } else {
      result[idx] = mergeSite(result[idx], mergingSite);
    }
  });
  return result;
};
