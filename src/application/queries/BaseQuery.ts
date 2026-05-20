export abstract class BaseQuery<TParams, TResult> {
  readonly __result!: TResult;

  abstract readonly key: string;

  constructor(protected readonly params: TParams) {}

  getParams(): TParams {
    return this.params;
  }
}
