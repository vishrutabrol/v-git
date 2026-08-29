import fs from "node:fs/promises";
import { ObjectStore } from "../../objects/objectStore.js";
import { Repository } from "../../repository/repository.js";

export async function hashObject(
  repository: Repository,
  filePath: string,
): Promise<string> {
  const content = await fs.readFile(filePath);

  const objectStore = new ObjectStore(repository.objectsPath);

  //   return objectStore.createObjectId(
  //     "blob",
  //     content
  //   );
  return objectStore.writeObject("blob", content);
}
