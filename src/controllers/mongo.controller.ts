import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Mongo} from '../models';
import {MongoRepository} from '../repositories';

export class MongoController {
  constructor(
    @repository(MongoRepository)
    public mongoRepository : MongoRepository,
  ) {}

  @post('/mongos', {
    responses: {
      '200': {
        description: 'Mongo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Mongo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mongo, {
            title: 'NewMongo',
            exclude: ['id'],
          }),
        },
      },
    })
    mongo: Omit<Mongo, 'id'>,
  ): Promise<Mongo> {
    return this.mongoRepository.create(mongo);
  }

  @get('/mongos/count', {
    responses: {
      '200': {
        description: 'Mongo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Mongo) where?: Where<Mongo>,
  ): Promise<Count> {
    return this.mongoRepository.count(where);
  }

  @get('/mongos', {
    responses: {
      '200': {
        description: 'Array of Mongo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Mongo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Mongo) filter?: Filter<Mongo>,
  ): Promise<Mongo[]> {
    return this.mongoRepository.find(filter);
  }

  @patch('/mongos', {
    responses: {
      '200': {
        description: 'Mongo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mongo, {partial: true}),
        },
      },
    })
    mongo: Mongo,
    @param.where(Mongo) where?: Where<Mongo>,
  ): Promise<Count> {
    return this.mongoRepository.updateAll(mongo, where);
  }

  @get('/mongos/{id}', {
    responses: {
      '200': {
        description: 'Mongo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Mongo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Mongo, {exclude: 'where'}) filter?: FilterExcludingWhere<Mongo>
  ): Promise<Mongo> {
    return this.mongoRepository.findById(id, filter);
  }

  @patch('/mongos/{id}', {
    responses: {
      '204': {
        description: 'Mongo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mongo, {partial: true}),
        },
      },
    })
    mongo: Mongo,
  ): Promise<void> {
    await this.mongoRepository.updateById(id, mongo);
  }

  @put('/mongos/{id}', {
    responses: {
      '204': {
        description: 'Mongo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() mongo: Mongo,
  ): Promise<void> {
    await this.mongoRepository.replaceById(id, mongo);
  }

  @del('/mongos/{id}', {
    responses: {
      '204': {
        description: 'Mongo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.mongoRepository.deleteById(id);
  }
}
