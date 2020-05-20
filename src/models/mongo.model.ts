import {Entity, model, property} from '@loopback/repository';

@model()
export class Mongo extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  constructor(data?: Partial<Mongo>) {
    super(data);
  }
}

export interface MongoRelations {
  // describe navigational properties here
}

export type MongoWithRelations = Mongo & MongoRelations;
