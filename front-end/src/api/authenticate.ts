import type { User } from '../@types/user';
import { api } from '../lib/axios'

import { AxiosInstance } from 'axios';

export class Authenticate {
  constructor(private readonly api: AxiosInstance) {}

  async login(params: {
    email: string
    password: string
  }): Promise<{ user: User; message: string }> {
    const { email, password } = params

    const response = await this.api.post('/authenticate/login', {
      email,
      password,
    })

    return response.data
  }

  async logged(): Promise<{ user: User; message: string }> {
    const response = await this.api.get('/authenticate/logged')

    return response.data
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.api.post('/authenticate/logout')

    return response.data
  }
}

export const authenticate = new Authenticate(api)
