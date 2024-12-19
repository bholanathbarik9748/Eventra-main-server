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
import { AuthCommonServices } from './common/services/Auth.common.service';
import { OtpMailService } from './common/notifications/OtpNotification';

// import Guard
import { AuthGuard } from './common/Guard/auth.guard';
import { ProfileController } from './module/Profile/profile.controller';
import { ProfileService } from './module/Profile/profile.service';
import { CloudinaryConfig } from './config/cloudinary.config';
import { UploadController } from './module/Upload/upload.controller';
import { CloudinaryService } from './module/Upload/cloudinary.service';
import { EventsController } from './module/events/events.controller';
import { EventsService } from './module/events/events.service';
import { TicketBookingModule } from './module/TicketBooking/ticket-booking.module';

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
    }),
    TicketBookingModule, // Make JwtService available to the app
  ],
  controllers: [
    AppController,
    AuthController,
    ProfileController,
    UploadController,
    EventsController,
  ], // Register controllers
  providers: [
    AppService,
    AuthService,
    AuthCommonServices,
    OtpMailService,
    ProfileService,
    EventsService,
    AuthGuard,
    CloudinaryConfig,
    CloudinaryService,
  ], // Register services
})
export class AppModule {}
