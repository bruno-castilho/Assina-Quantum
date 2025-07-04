import { Injectable } from '@nestjs/common'
import {
  PrismaCertificatesRepository,
  PrismaUsersRepository,
} from 'src/persistence/repositories/prisma-repository.service'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { DockerService } from 'src/lib/dockernode.service'
import { LocalFileSystem } from 'src/persistence/file-system/local-file-system.service'
import { env } from 'src/env'
import { CertificateDoesntExistError } from './errors/certificate-doesnt-exist-error'

@Injectable()
export class SignaturesUseCases {
  constructor(
    private usersRepository: PrismaUsersRepository,
    private certificatesRepository: PrismaCertificatesRepository,
    private docker: DockerService,
    private localFileSystem: LocalFileSystem,
  ) {}

  async signDocument(params: {
    userId: string
    document: Buffer
    secret_key: Buffer
  }) {
    const { userId, document, secret_key } = params

    const user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const userCertificate = await this.certificatesRepository.findUnique({
      where: {
        owner_id: userId,
      },
    })

    if (!userCertificate) throw new CertificateDoesntExistError()

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'secret_key.sec',
      content: secret_key,
    })

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'document.pdf',
      content: document,
    })

    const container = await this.docker.createContainer({
      Image: 'crystals-dilithium',
      Tty: false,
      HostConfig: {
        Binds: [
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/input`,
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/output`,
        ],

        AutoRemove: true,
      },
      Cmd: ['sign-file.py', 'document.pdf'],
    })

    await container.start()

    await container.wait()

    const signatureFile = await this.localFileSystem.getFile({
      foldername: `tmp/${userId}`,
      filename: 'signature.sig',
    })

    const certificateFile = await this.localFileSystem.getFile({
      foldername: `certificates/${userId}`,
      filename: 'certificate.crt',
    })

    // Checar se o certificado realmente valida a assinatura

    const signature = {
      signature: signatureFile.toString(),
      certificate: certificateFile.toString(),
    }

    await this.localFileSystem.deleteFolder({
      foldername: `tmp/${userId}`,
    })

    return {
      signature,
    }
  }

  async verifySign(params: {
    userId: string
    document: Buffer
    signature: Buffer
  }) {
    const { userId, document, signature: signatureFile } = params

    const user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const {
      signature: signatureDocument,
      certificate: certificateAsString,
    }: {
      signature: string
      certificate: string
    } = JSON.parse(signatureFile.toString('utf-8'))

    const { signature: signatureCertificate, ...certificate } = JSON.parse(
      certificateAsString,
    ) as {
      name: string
      email: string
      valid_from: Date
      valid_to: Date
      public_key: string
      algorithm: string
      signature: string
    }

    // Verify certificate signature
    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'certificate.sec',
      content: Buffer.from(JSON.stringify(certificate), 'utf-8'),
    })

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'signature.sig',
      content: Buffer.from(signatureCertificate, 'utf-8'),
    })

    let container = await this.docker.createContainer({
      Image: 'crystals-dilithium',
      Tty: false,
      HostConfig: {
        Binds: [
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/files`,
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/AC:/key`,
        ],
        AutoRemove: true,
      },
      Cmd: ['verify-sign.py', 'certificate.sec'],
    })

    await container.start()

    const resultVerifyCertificateSignature = await container.wait()

    if (
      resultVerifyCertificateSignature.StatusCode === 1 ||
      resultVerifyCertificateSignature.StatusCode === 2
    )
      return false

    // Verify document signature
    const { public_key } = certificate

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'public_key.pub',
      content: Buffer.from(public_key, 'utf-8'),
    })

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'document',
      content: document,
    })

    await this.localFileSystem.saveFile({
      foldername: `/tmp/${userId}`,
      filename: 'signature.sig',
      content: Buffer.from(signatureDocument, 'utf-8'),
    })

    container = await this.docker.createContainer({
      Image: 'crystals-dilithium',
      Tty: false,
      HostConfig: {
        Binds: [
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/files`,
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/key`,
        ],
      },
      Cmd: ['verify-sign.py', 'document'],
    })

    await container.start()

    const resultVerifyDocumentSignature = await container.wait()

    if (
      resultVerifyDocumentSignature.StatusCode === 1 ||
      resultVerifyDocumentSignature.StatusCode === 2
    )
      return false

    await this.localFileSystem.deleteFolder({
      foldername: `tmp/${userId}`,
    })

    return true
  }
}
