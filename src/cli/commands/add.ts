import fs from "node:fs/promises";

import { Repository } from "../../repository/repository.js";
import { ObjectStore } from "../../objects/objectStore.js";
import { Index } from "../../index/index.js";

export async function add(
  repository: Repository,
  filePath: string
): Promise<void> {
  const content = await fs.readFile(filePath);

  const objectStore = new ObjectStore(
    repository.objectsPath
  );

  const objectId = await objectStore.writeObject(
    "blob",
    content
  );

  const index = new Index(
    repository.indexPath
  );

  await index.load();

  index.set(filePath, objectId);

  await index.save();
}