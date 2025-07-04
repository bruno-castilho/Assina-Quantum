import { promises as fs } from 'fs'
import * as path from 'path'
import { env } from 'src/env'

export class LocalFileSystem {
  private srcPath = env.LOCAL_FILE_SYSTEM_SOURCE_PATH

  async getFile(params: { foldername: string; filename: string }) {
    const { filename, foldername } = params
    const fullPath = path.join(this.srcPath, foldername, filename)

    const data = await fs.readFile(fullPath)
    return data
  }

  async saveFile(params: {
    foldername: string
    filename: string
    content: Buffer
  }) {
    const { content, filename, foldername } = params
    const folderPath = path.join(this.srcPath, foldername)
    const fullPath = path.join(folderPath, filename)

    await fs.mkdir(folderPath, { recursive: true })

    await fs.writeFile(fullPath, content)
  }

  async deleteFile(params: { foldername: string; filename: string }) {
    const { filename, foldername } = params
    const fullPath = path.join(this.srcPath, foldername, filename)

    await fs.unlink(fullPath)
  }

  async creatFolder(params: { foldername: string }) {
    const { foldername } = params
    const folderPath = path.join(this.srcPath, foldername)
    await fs.mkdir(folderPath, { recursive: true })
  }

  async deleteFolder(params: { foldername: string }) {
    const { foldername } = params
    const folderPath = path.join(this.srcPath, foldername)

    await fs.rm(folderPath, { recursive: true, force: true })
  }
}
