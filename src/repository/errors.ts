export class RepositoryAlreadyExistsError extends Error {
  constructor(path: string) {
    super(`A v-git repository already exists at ${path}`);
    this.name = "RepositoryAlreadyExistsError";
  }
}