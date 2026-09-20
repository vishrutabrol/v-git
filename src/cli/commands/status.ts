import fs from "node:fs/promises";
import path from "node:path";

import { Repository } from "../../repository/repository.js";
import { ObjectStore } from "../../objects/objectStore.js";
import { Index } from "../../index/index.js";

type StatusResult = {
  modified: string[];
  untracked: string[];
  deleted: string[];
};

export async function status(
  repository: Repository
): Promise<StatusResult> {
  const index = new Index(
    repository.indexPath
  );

  await index.load();

  const objectStore = new ObjectStore(
    repository.objectsPath
  );

  const result: StatusResult = {
    modified: [],
    untracked: [],
    deleted: [],
  };

  const indexEntries = index.entries();

  // Check tracked files
  for (
    const [filePath, indexedObjectId]
    of Object.entries(indexEntries)
  ) {
    const absolutePath = path.resolve(
      repository.rootPath,
      filePath
    );

    try {
      await fs.access(absolutePath);
    } catch {
      result.deleted.push(filePath);
      continue;
    }

    const content = await fs.readFile(
      absolutePath
    );

    const currentObjectId =
      objectStore.createObjectId(
        "blob",
        content
      );

    if (
      currentObjectId !== indexedObjectId
    ) {
      result.modified.push(filePath);
    }
  }

  // Check untracked files
  const workingDirectoryEntries =
    await fs.readdir(
      repository.rootPath,
      {
        withFileTypes: true,
      }
    );

  for (
    const entry of workingDirectoryEntries
  ) {
    if (entry.name === ".v-git") {
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const filePath = entry.name;

    if (index.get(filePath) === undefined) {
      result.untracked.push(filePath);
    }
  }

  return result;
}