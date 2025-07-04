import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './application/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { env } from './env'
import fastifyCors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { IoAdapter } from '@nestjs/platform-socket.io'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.setGlobalPrefix('api')
  app.useWebSocketAdapter(new IoAdapter(app))

  await app.register(fastifyCors, {
    origin: env.ORIGIN !== '*' ? env.ORIGIN : true,
    methods: ['DELETE', 'PUT', 'POST', 'GET', 'PATCH', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  })
  await app.register(fastifyCookie)
  await app.register(multipart, {
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1GB em bytes
    },
  })

  app.listen({ port: env.PORT, host: '0.0.0.0' })
}
bootstrap()
