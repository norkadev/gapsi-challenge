import { httpClient } from '../../shared/api/httpClient'

export interface WelcomeResponse {
  message: string
}

export interface VersionResponse {
  version: string
}

export async function getWelcomeMessage(
  signal?: AbortSignal,
): Promise<WelcomeResponse> {
  const response = await httpClient.get<WelcomeResponse>('/api/v1/welcome', {
    signal,
  })
  return response.data
}

export async function getApplicationVersion(
  signal?: AbortSignal,
): Promise<VersionResponse> {
  const response = await httpClient.get<VersionResponse>('/api/v1/version', {
    signal,
  })
  return response.data
}
