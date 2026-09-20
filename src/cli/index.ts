import process from "node:process";
import { Repository } from "../repository/repository.js";
import { initRepository } from "./commands/init.js";
import { hashObject } from "./commands/hashObject.js";
import { add } from "./commands/add.js";
import { status } from "./commands/status.js";

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

  if (command === "add") {
    const filePath = process.argv[3];

    if (!filePath) {
      console.error("Usage: add <file>");
      process.exit(1);
    }

    const currentDirectory = process.cwd();

    const repository = new Repository(currentDirectory);

    await add(repository, filePath);

    console.log(`Added ${filePath}`);

    return;
  }

  if (command === "status") {
    const currentDirectory = process.cwd();

    const repository = new Repository(currentDirectory);

    const result = await status(repository);

    if (result.modified.length > 0) {
      console.log("Changes not staged:");

      for (const filePath of result.modified) {
        console.log(`  modified: ${filePath}`);
      }

      console.log();
    }

    if (result.deleted.length > 0) {
      console.log("Deleted:");

      for (const filePath of result.deleted) {
        console.log(`  deleted: ${filePath}`);
      }

      console.log();
    }

    if (result.untracked.length > 0) {
      console.log("Untracked files:");

      for (const filePath of result.untracked) {
        console.log(`  ${filePath}`);
      }

      console.log();
    }

    if (
      result.modified.length === 0 &&
      result.deleted.length === 0 &&
      result.untracked.length === 0
    ) {
      console.log("Working tree clean.");
    }

    return;
  }

  console.log("Unknown command.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
