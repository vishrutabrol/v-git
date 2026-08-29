import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export class ObjectStore {
  constructor(
    private readonly objectsPath: string
  ) {}

  private serializeObject(
    type: string,
    content: Buffer
  ): Buffer {
    const header = Buffer.from(
      `${type} ${content.length}\0`,
      "utf8"
    );

    return Buffer.concat([
      header,
      content,
    ]);
  }

  createObjectId(
    type: string,
    content: Buffer
  ): string {
    const objectData = this.serializeObject(
      type,
      content
    );

    return crypto
      .createHash("sha256")
      .update(objectData)
      .digest("hex");
  }

  async writeObject(
    type: string,
    content: Buffer
  ): Promise<string> {
    const objectData = this.serializeObject(
      type,
      content
    );

    const objectId = crypto
      .createHash("sha256")
      .update(objectData)
      .digest("hex");

    const directoryName = objectId.slice(0, 2);
    const fileName = objectId.slice(2);

    const objectDirectory = path.join(
      this.objectsPath,
      directoryName
    );

    const objectPath = path.join(
      objectDirectory,
      fileName
    );

    try {
      await fs.access(objectPath);

      // Object already exists.
      return objectId;
    } catch {
      // Object does not exist.
    }

    await fs.mkdir(objectDirectory, {
      recursive: true,
    });

    await fs.writeFile(
      objectPath,
      objectData
    );

    return objectId;
  }
}
