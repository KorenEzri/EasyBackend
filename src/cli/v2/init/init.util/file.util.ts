import fs from "fs";
import ncp from "ncp";
import { promisify } from "util";

import { IMainOptions } from "../../../.../../../types";
import Logger from "../../../../logger/logger";

const copy = promisify(ncp);
const write = promisify(fs.writeFile);

export const writeToEnv = async (options: Partial<IMainOptions>) => {
  if (!options.databaseUri || typeof options.databaseUri !== "string") {
    options.databaseUri = "__";
  }
  await write(`${process.cwd()}/.env`, `MONGO_URI="${options.databaseUri}"`);
};

export const copyTemplateFiles = async (options: Partial<IMainOptions>) => {
  const { templateDirectory, targetDirectory } = options;
  const copyOptions = detemineFilesToCopy(options);
  if (!templateDirectory || !targetDirectory) return;
  try {
    await Promise.all(
      copyOptions.map((option: string) => {
        console.log("COPYING OTHER");
        copy(
          `${templateDirectory}/${option}`,
          targetDirectory, // copies the template into the relevant location without overwriting anything
          {
            clobber: false,
          }
        );
      })
    );
    await copy(
      `${templateDirectory}\\basics`,
      targetDirectory, // copies the template into the relevant location without overwriting anything
      {
        clobber: false,
      }
    );
  } catch (error) {
    // swallow
  }
};

export const detemineFilesToCopy = (options: Partial<IMainOptions>) => {
  const { level } = options;
  const copyOptions: string[] = [];
  if (level?.includes("Full")) {
    copyOptions.push("full");
  }
  if (level?.includes("Medium")) {
    copyOptions.push("medium");
  }
  if (level?.includes("Basic")) {
    copyOptions.push("basics");
  }
  return copyOptions;
};
