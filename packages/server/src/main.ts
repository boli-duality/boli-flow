import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  await app.listen(process.env.PORT!)
}
bootstrap().catch(console.error)
