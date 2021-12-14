import inquirer from "inquirer";
import { DatabaseStorageType } from "./../../../../../../../types/trackerStorage";
import { InterfaceStorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { customTypeQuestions } from "..";
import { chooseUniqueProp } from "../../../databaseSchema/databaseShema.utils";

export const shouldIncludeDBSchema = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { dbSchema } = await inquirer.prompt([
    customTypeQuestions.includeDBSchema,
  ]);

  tracker.addToStorage(
    { key: InterfaceStorageType.includeDBSchema, value: dbSchema },
    true
  );

  if (dbSchema) {
    const schemaProps: string[] = tracker.getFromStorage(
      InterfaceStorageType.typeCreationProps
    );

    const schemaName: string = tracker.getFromStorage(
      InterfaceStorageType.typeName
    );

    tracker.addToStorage({
      key: DatabaseStorageType.schemaProps,
      value: schemaProps,
    });

    tracker.addToStorage({
      key: DatabaseStorageType.schemaName,
      value: schemaName,
    });

    await chooseUniqueProp(tracker);
  }
};
