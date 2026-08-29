import process from "node:process";
import { Repository } from "../repository/repository.js";
import { initRepository } from "./commands/init.js";
import { hashObject } from "./commands/hashObject.js";

async function main(): Promise<void> {
  const command = process.argv[2];

  if (command === "init") {
    const currentDirectory = process.cwd();

    const repository = new Repository(currentDirectory);

    await initRepository(repository);

    console.log(`Initialized empty v-git repository in ${repository.gitPath}`);

    return;
  }

  if (command === "hash-object") {
    const filePath = process.argv[3];

    if (!filePath) {
      console.error("Usage: hash-object <file>");
      process.exit(1);
    }

    const currentDirectory = process.cwd();

    const repository = new Repository(currentDirectory);

    const objectId = await hashObject(repository, filePath);

    console.log(objectId);

    return;
  }

  console.log("Unknown command.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
