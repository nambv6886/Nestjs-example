import { Module } from '@nestjs/common';
import { CacheServie } from './cache.service';

const services = [
  CacheServie
]

@Module({
  providers: [
    ...services
  ],
  exports: [
    ...services
  ]
})
export class SharedModule {}
