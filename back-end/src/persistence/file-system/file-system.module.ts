import { Module } from '@nestjs/common'
import { LocalFileSystem } from './local-file-system.service'

@Module({
  providers: [LocalFileSystem],
  exports: [LocalFileSystem],
})
export class FileSystemModule {}
