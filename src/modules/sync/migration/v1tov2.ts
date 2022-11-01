import { DB } from "src/services/encryptedDB";

/*
Files exported from v1 could have sites that were empty
*/
export const v1tov2 = (db1: DB): DB => ({
  sites: db1.sites.filter((site) => "id" in site),
  version: 2,
});
