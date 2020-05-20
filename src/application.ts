import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {RepositoryMixin, SchemaMigrationOptions} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

export class TodoListApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }



  async migrateSchema(options?: SchemaMigrationOptions) {

    // 1. Run migration scripts provided by connectors

    // @ts-ignore
    if (options.existingSchema === 'drop') {
      // @ts-ignore
      options.models = options?.models.reverse();
    }
    // @ts-ignore
    const operation = options.existingSchema === 'drop' ? 'automigrate' : 'autoupdate';
    // Instantiate all repositories to ensure models are registered & attached
    // to their datasources
    const repoBindings = this.findByTag('repository');
    await Promise.all(repoBindings.map(b => this.get(b.key)));
    // Look up all datasources and update/migrate schemas one by one
    const dsBindings = this.findByTag('datasource');
    for (const b of dsBindings) {
      const ds = await this.get(b.key);
      // console.log(ds);
      // @ts-ignore
      if (operation in ds && typeof ds[operation] === 'function') {
        console.log('Migrating dataSource %s', b.key);
        // @ts-ignore
        if (!options?.models || options?.models.length === 0) {
          // @ts-ignore
          await ds[operation](options.models);
        } else {
          const models = [];
          for (const model of options?.models) {
            // @ts-ignore
            if (Object.keys(ds.definitions).includes(model)) {
              models.push(model);
            }
          }
          // @ts-ignore
          await ds[operation](models);
        }
      } else {
        // debug('Skipping migration of dataSource %s', b.key);
      }
    }


    // await super.migrateSchema(options);
  }
}
