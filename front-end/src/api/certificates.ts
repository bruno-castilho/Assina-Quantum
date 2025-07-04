import type { Certificate } from '../@types/certificate';
import { api } from '../lib/axios'

import type { AxiosInstance } from 'axios'


export class Certificates {
  constructor(private readonly api: AxiosInstance) {}

  async createCertificate(): Promise<Blob> {
    const response = await this.api.post('/certificates', null, {
      responseType: 'blob'
    })

    return response.data
  }

  async myCertificate(): Promise<{ certificate: Certificate }> {

    const response = await this.api.get('/certificates/mycertificate')

    return response.data
  }

    async removeCertificate(params: {
      certificateId: string
    }): Promise<{ message: string }> {
    const {certificateId} = params

    const response = await this.api.delete(`/certificates/${certificateId}`)

    return response.data
  }
}

export const certificate = new Certificates(api)
