import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
  ],
})
export class AppModule {}
