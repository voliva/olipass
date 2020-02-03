import { createStandardAction } from "@voliva/react-observable";
import { DB } from "src/services/encryptedDB";

export const uploadFile = createStandardAction<{
  password?: string;
  file: File;
}>("upload file");
export const uploadSuccess = createStandardAction<DB>("upload success");
export const uploadError = createStandardAction<string>("upload error");
export const exportDatabase = createStandardAction("export db");
