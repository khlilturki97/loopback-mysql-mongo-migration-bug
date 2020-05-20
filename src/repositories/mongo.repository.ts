import {DefaultCrudRepository} from '@loopback/repository';
import {Mongo, MongoRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MongoRepository extends DefaultCrudRepository<
  Mongo,
  typeof Mongo.prototype.id,
  MongoRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Mongo, dataSource);
  }
}
