import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  const port = process.env.PORT ?? 3000
  console.log(port)

  await app.listen(port)
}
bootstrap().catch(console.error)
