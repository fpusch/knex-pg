import { Model } from 'objection';
import { StreamingQueryBuilder } from '../util/utils';

export class BaseModel extends Model {
  readonly id: number;
  
  QueryBuilderType!: StreamingQueryBuilder<this>;
  static QueryBuilder = StreamingQueryBuilder;
}