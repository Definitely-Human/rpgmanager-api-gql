import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailModuleOptions } from './mail.interfaces';
import { MailService } from './mail.service';
import { HttpModule } from '@nestjs/axios';
import { MAIL_CONFIG_OPTIONS } from './mail.constants';

@Module({ imports: [HttpModule] })
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        { provide: MAIL_CONFIG_OPTIONS, useValue: options },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
