import path from "node:path";

export class Repository {
  public readonly rootPath: string;
  public readonly gitPath: string;
  public readonly objectsPath: string;
  public readonly refsPath: string;
  public readonly headsPath: string;
  public readonly headPath: string;
  public readonly indexPath: string;
  public readonly configPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;

    this.gitPath = path.join(rootPath, ".v-git");

    this.objectsPath = path.join(this.gitPath, "objects");

    this.refsPath = path.join(this.gitPath, "refs");

    this.headsPath = path.join(this.refsPath, "heads");

    this.headPath = path.join(this.gitPath, "HEAD");

    this.indexPath = path.join(this.gitPath, "index.json");

    this.configPath = path.join(this.gitPath, "config.json");
  }
}