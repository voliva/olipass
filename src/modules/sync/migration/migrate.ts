import { DB } from "src/services/encryptedDB";
import { v0tov1 } from "./v0tov1";

export const migrate = (db: any): DB => {
  switch (db.version) {
    case undefined:
      db = v0tov1(db);
  }
  return db;
};
