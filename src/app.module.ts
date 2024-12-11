import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule

// Import controllers
import { AppController } from './app.controller';
import { AuthController } from './module/Auth/auth.controller';

// Import services
import { AppService } from './app.service';
import { AuthService } from './module/Auth/auth.service';
import { AuthCommonServices } from './common/services/auth.common.service';
import { OtpMailService } from './common/notifications/OtpNotification';

// import Guard
import { AuthGuard } from './common/Guard/auth.guard';
import { ProfileController } from './module/Profile/profile.controller';
import { ProfileService } from './module/Profile/profile.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables from .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Aiven host
      port: Number(process.env.DB_PORT), // Aiven port
      username: process.env.DB_USER, // Aiven username
      password: process.env.DB_PASS, // Aiven password
      database: process.env.DB_NAME, // Aiven database name
      ssl: {
        rejectUnauthorized: false, // Important for SSL connections
      },
      synchronize: true, // Enable synchronization for testing
      autoLoadEntities: true,
      logging: true, // Enable logging to check connection
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Load JWT secret from environment
      signOptions: { expiresIn: '30d' }, // Set expiration time for the token (1 hour)
    }), // Make JwtService available to the app
  ],
  controllers: [AppController, AuthController, ProfileController], // Register controllers
  providers: [
    AppService,
    AuthService,
    AuthCommonServices,
    OtpMailService,
    ProfileService,
    AuthGuard,
  ], // Register services
})
export class AppModule {}
