import fs from "node:fs/promises";
import path from "node:path";
 
type IndexData = Record<string, string>;
 
export class Index {
  private data: IndexData = {};
 
  constructor(
    private readonly indexPath: string
  ) {}
 
  async load(): Promise<void> {
    let content: string;
 
    try {
      content = await fs.readFile(
        this.indexPath,
        "utf8"
      );
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        this.data = {};
 
        return;
      }
 
      throw error;
    }
 
    if (content.trim() === "") {
      throw new Error(
        `Index file is empty: ${ this.indexPath } `
      );
    }
 
    let parsed: unknown;
 
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(
        `Invalid JSON in index file: ${ this.indexPath } `
      );
    }
 
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        "Invalid index format: expected a JSON object"
      );
    }
 
    for (const [filePath, objectId] of Object.entries(
      parsed
    )) {
      if (typeof objectId !== "string") {
        throw new Error(
          `Invalid object ID for path: ${ filePath } `
        );
      }
    }
 
    this.data = parsed as IndexData;
  }
 
  async save(): Promise<void> {
    const content = JSON.stringify(
      this.data,
      null,
      2
    );
 
    await fs.writeFile(
      this.indexPath,
      content + "\n",
      "utf8"
    );
  }
 
  set(
    filePath: string,
    objectId: string
  ): void {
    this.data[filePath] = objectId;
  }
 
  get(
    filePath: string
  ): string | undefined {
    return this.data[filePath];
  }
}
 