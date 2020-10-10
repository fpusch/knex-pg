import { Model, Page, QueryBuilder, snakeCaseMappers } from 'objection';
import { Writable } from 'stream';

/**
 * An extension of the BaseQueryBuilder for simple streaming cases
 * see https://vincit.github.io/objection.js/recipes/custom-query-builder.html#extending-the-query-builder-in-typescript
 * and https://github.com/Vincit/objection.js/issues/54#issuecomment-608382486
 */
export class StreamingQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {

  ArrayQueryBuilderType!: StreamingQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: StreamingQueryBuilder<M, M>;
  NumberQueryBuilderType!: StreamingQueryBuilder<M, number>;
  PageQueryBuilderType!: StreamingQueryBuilder<M, Page<M>>;

  public stream(resultHandler: (result: M) => void | Promise<void>) {
    const modelClass = this.modelClass();
    const { parse: keysToCamelCase } = snakeCaseMappers();

    const out = new Writable({
      objectMode: true,
      async write(knexResult, _, next) {
        try {
          const objectionModel = keysToCamelCase(knexResult);

          const model = modelClass.fromDatabaseJson(objectionModel);

          await resultHandler(model);

          next();
        } catch (e) {
          next(e);
        }
      }
    });

    return new Promise((resolve, reject) => {
      out.on('finish', resolve);
      out.on('error', reject);
      this.toKnexQuery().pipe(out);
    });
  }
}