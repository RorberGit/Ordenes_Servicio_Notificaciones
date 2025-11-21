// useLogin.ts
import { useMutation } from '@tanstack/react-query'
import { httpService } from '@/services/apiClient'
import type { UserData } from '@/types/auth'

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token?: string
  user?: UserData
}

export function useLogin() {
  return useMutation({
    mutationFn: async (variables: LoginRequest) => {
      const response = await httpService.post<LoginResponse>('/auth/login/', variables)
      return response.data
    },
  })
}
