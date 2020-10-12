import Objection, { Model, Page, QueryBuilder, snakeCaseMappers } from 'objection';
import { Transform, Writable } from 'stream';

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

  /**
   * Stream the Model instances from the database rather than building up an Array in memory calling the given handler for every instance.
   * Works only for simple queries without eagerLoading of related objects in the graph
   * 
   * @param resultHandler called for every model instance retrieved from the database
   */
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

  /**
   * Similar to stream() but return a PassThrough of the stream for convenience
   * 
   * As every piped stream has an overhead, it might be useful to inject further processing into this transform stream.
   */
  public streamThrough() {
    const modelClass = this.modelClass();
    const { parse: keysToCamelCase } = snakeCaseMappers();
    const out = new Transform({
      objectMode: true,
      transform(chunk: Objection.Pojo, _, next: (error?: Error, data?: M) => void) {
        try {
          const objectionModel = keysToCamelCase(chunk);
          const model = modelClass.fromDatabaseJson(objectionModel);
          next(null, model);
        } catch (e) {
          next(e);
        }
      }
    });
    return this.toKnexQuery().pipe(out);
  }
}