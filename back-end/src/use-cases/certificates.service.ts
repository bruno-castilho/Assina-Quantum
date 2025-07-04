import { Injectable } from '@nestjs/common'
import {
  PrismaCertificatesRepository,
  PrismaUsersRepository,
} from 'src/persistence/repositories/prisma-repository.service'
import { UserDoesntExistError } from './errors/user-doesnt-exist-error'
import { UserAlreadyHasCertificate } from './errors/user-already-has-certificate'
import { DockerService } from 'src/lib/dockernode.service'
import { LocalFileSystem } from 'src/persistence/file-system/local-file-system.service'
import { env } from 'src/env'
import { CertificateDoesntExistError } from './errors/certificate-doesnt-exist-error'
import { NotCetificateOwnerError } from './errors/not-certificate-owner-error'

@Injectable()
export class CertificatesUseCases {
  constructor(
    private usersRepository: PrismaUsersRepository,
    private certificatesRepository: PrismaCertificatesRepository,
    private docker: DockerService,
    private localFileSystem: LocalFileSystem,
  ) {}

  async createCertificate(params: { userId: string }) {
    const { userId } = params

    const user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const useCertificate = await this.certificatesRepository.findUnique({
      where: {
        owner_id: userId,
      },
    })

    if (useCertificate) throw new UserAlreadyHasCertificate()

    await this.localFileSystem.creatFolder({
      foldername: `/tmp/${userId}`,
    })

    // Generate key pair
    let container = await this.docker.createContainer({
      Image: 'crystals-dilithium',
      Tty: false,
      HostConfig: {
        Binds: [
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/output`,
        ],
        AutoRemove: true,
      },
      Cmd: ['generate-keypair.py'],
    })

    await container.start()

    await container.wait()

    const public_key = await this.localFileSystem.getFile({
      foldername: `tmp/${userId}`,
      filename: 'public_key.pub',
    })

    const secret_key = await this.localFileSystem.getFile({
      foldername: `tmp/${userId}`,
      filename: 'secret_key.sec',
    })

    // Create Certificate
    const certificate = {
      name: `${user.name} ${user.last_name}`,
      email: user.email,
      valid_from: new Date(),
      valid_to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year
      public_key: public_key.toString('utf-8'),
      algorithm: 'ML-DSA-65',
    }

    await this.localFileSystem.saveFile({
      foldername: `tmp/${userId}`,
      filename: 'certificate.json',
      content: Buffer.from(JSON.stringify(certificate), 'utf-8'),
    })

    // Sign Certificate
    container = await this.docker.createContainer({
      Image: 'crystals-dilithium',
      Tty: false,
      HostConfig: {
        Binds: [
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/AC:/home/app/input`,
          `${env.LOCAL_FILE_SYSTEM_SOURCE_PATH}/tmp/${userId}:/home/app/output`,
        ],

        AutoRemove: true,
      },
      Cmd: ['sign-file.py', 'certificate.json'],
    })

    await container.start()

    await container.wait()

    const signature = await this.localFileSystem.getFile({
      foldername: `tmp/${userId}`,
      filename: 'signature.sig',
    })

    // Save Certificate
    const certificateWithSignature = {
      ...certificate,
      signature: signature.toString('utf-8'),
    }

    await this.localFileSystem.saveFile({
      foldername: `certificates/${userId}/`,
      filename: 'certificate.crt',
      content: Buffer.from(JSON.stringify(certificateWithSignature), 'utf-8'),
    })

    this.certificatesRepository.create({
      data: {
        owner: {
          connect: user,
        },
        path: `certificates/${userId}/certificate.crt`,
        valid_from: certificate.valid_from,
        valid_to: certificate.valid_to,
      },
    })

    await this.localFileSystem.deleteFolder({
      foldername: `tmp/${userId}`,
    })

    return {
      secret_key,
    }
  }

  async myCertificate(params: { userId: string }) {
    const { userId } = params

    const certificate = await this.certificatesRepository.findUnique({
      include: {
        owner: {
          omit: {
            password_hash: true,
          },
        },
      },
      omit: {
        owner_id: true,
        path: true,
      },
      where: {
        owner_id: userId,
      },
    })

    return {
      certificate,
    }
  }

  async removeCertificate(params: { userId: string; certificateId: string }) {
    const { userId, certificateId } = params

    const user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw new UserDoesntExistError()

    const certificate = await this.certificatesRepository.findUnique({
      where: {
        id: certificateId,
      },
    })

    if (!certificate) throw new CertificateDoesntExistError()

    if (certificate.owner_id !== userId) throw new NotCetificateOwnerError()

    await this.localFileSystem.deleteFile({
      foldername: `certificates/${userId}`,
      filename: 'certificate.crt',
    })

    await this.certificatesRepository.delete({
      where: {
        id: certificateId,
      },
    })
  }
}
