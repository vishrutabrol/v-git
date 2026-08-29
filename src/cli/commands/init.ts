import fs from "node:fs/promises";
import { Repository } from "../../repository/repository.js";
import { RepositoryAlreadyExistsError } from "../../repository/errors.js";

export async function initRepository(
  repository: Repository
): Promise<void> {  
  try {
    await fs.access(repository.gitPath);

    throw new RepositoryAlreadyExistsError(repository.gitPath);
  } catch (error: unknown) {
    if (error instanceof RepositoryAlreadyExistsError) {
      throw error;
    }

    // .v-git does not exist, so we can initialize.
  }

  await fs.mkdir(repository.objectsPath, {
    recursive: true,
  });

  await fs.mkdir(repository.headsPath, {
    recursive: true,
  });

  await fs.writeFile(
    repository.headPath,
    "ref: refs/heads/main\n",
    "utf8"
  );

  await fs.writeFile(
    repository.indexPath,
    "{}\n",
    "utf8"
  );

  await fs.writeFile(
    repository.configPath,
    "{}\n",
    "utf8"
  );
}