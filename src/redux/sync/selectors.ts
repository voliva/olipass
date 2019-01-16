import { ApplicationState } from "..";

export const needsPrompt = (state: ApplicationState) => state.sync.promptImportPsw;
