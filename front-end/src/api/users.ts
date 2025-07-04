import { type AxiosInstance } from 'axios'
import { api } from '../lib/axios'
import type { User } from '../@types/user'


export class Users {
  constructor(private readonly api: AxiosInstance) {}

  async register(params: {
    name: string
    last_name: string
    email: string
    password: string
  }): Promise<{ message: string; user: User }> {
    const { name, last_name, email, password } = params

    const response = await this.api.post('/users', {
      name,
      last_name,
      email,
      password,
    })

    return response.data
  }

  async updateProfile(params: {
    name: string
    last_name: string
    email: string
    password: string
    new_password?: string
  }): Promise<{ message: string; user: User }> {
    console.log(params)
    const { email, last_name, name, password, new_password } = params
    const response = await this.api.put('/users/profile', {
      email,
      last_name,
      name,
      password,
      new_password,
    })

    return response.data
  }
}

export const users = new Users(api)
