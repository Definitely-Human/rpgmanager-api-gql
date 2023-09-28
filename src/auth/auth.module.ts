import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthModuleOptions } from './auth.interfaces';

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UsersModule,
        JwtModule.register({
          global: true,
          secret: options.privateKey,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      providers: [
        AuthService,
        AuthResolver,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    };
  }
}
