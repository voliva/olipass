import { DB } from "src/services/encryptedDB";
import { v0tov1 } from "./v0tov1";
import { v1tov2 } from "./v1tov2";

export const migrate = (db: any): DB => {
  /* eslint-disable no-fallthrough */
  switch (db.version) {
    case undefined:
      db = v0tov1(db);
    case 1:
      db = v1tov2(db);
  }
  return db;
};
