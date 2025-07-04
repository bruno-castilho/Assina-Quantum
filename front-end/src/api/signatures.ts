import { api } from '../lib/axios'
import type { AxiosInstance } from 'axios'


export class Signatures {
  constructor(private readonly api: AxiosInstance) {}

  async signDocument(params: { form: FormData }): Promise<Blob> {
    const { form } = params;
    const response = await this.api.post('/signatures', form, {
      responseType: 'blob',
    });

    return response.data;
  }

  async verifySign(params: { form: FormData }): Promise<{message: string}> {
    const { form } = params;
    const response = await this.api.post('/signatures/verify', form);

    return response.data;
  }


}

export const signatures = new Signatures(api)
