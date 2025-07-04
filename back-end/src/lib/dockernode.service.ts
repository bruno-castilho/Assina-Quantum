import * as Docker from 'dockerode'

export class DockerService extends Docker {
  constructor() {
    super({ socketPath: '/var/run/docker.sock' })
  }
}
