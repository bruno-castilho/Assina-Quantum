import {
  Avatar,
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  TextField,
} from '@mui/material'
import { Card } from '../../components/Card'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Edit } from '@mui/icons-material'
import { users } from '../../api/users'
import { useContext } from 'react'
import { AlertContext } from '../../context/AlertContext'
import axios from 'axios'
import type { User } from '../../@types/user'

export const ProfileFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Digite um nome' })
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
        message: 'O nome deve conter apenas letras',
      }),

    last_name: z
      .string()
      .trim()
      .min(1, { message: 'Digite um sobrenome' })
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
        message: 'O sobrenome deve conter apenas letras',
      }),

    email: z.string().trim().email({ message: 'E-mail inválido' }),

    new_password: z
      .string()
      .trim()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/(?=.*[A-Z])/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/(?=.*[0-9])/, {
        message: 'A senha deve conter pelo menos um número',
      })
      .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'A senha deve conter pelo menos um símbolo especial',
      })
      .optional()
      .or(z.literal('')),

    repeat_password: z
      .string()
      .trim()
      .min(1, { message: 'Este campo não pode ficar vazio' })
      .optional()
      .or(z.literal('')),

    password: z
      .string()
      .trim()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .regex(/(?=.*[A-Z])/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/(?=.*[0-9])/, {
        message: 'A senha deve conter pelo menos um número',
      })
      .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'A senha deve conter pelo menos um símbolo especial',
      }),
  })
  .refine(
    (data) => !data.new_password || data.new_password === data.repeat_password,
    {
      path: ['repeat_password'],
      message: 'As senhas não coincidem',
    },
  )

type ProfileFormSchemaType = z.infer<typeof ProfileFormSchema>

export function Profile() {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<User>(['user'])
  const { error, success } = useContext(AlertContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(ProfileFormSchema),
    values: {
      email: user ? user.email : '',
      name: user ? user.name : '',
      last_name: user ? user.last_name : '',
      password: '',
    },
  })

  const { mutateAsync: updateProfileFn, isPending } = useMutation({
    mutationFn: async ({
      name,
      last_name,
      email,
      password,
      new_password,
    }: ProfileFormSchemaType) =>
      await users.updateProfile({
        name,
        last_name,
        email,
        password,
        new_password,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<User>(['user'], (oldUser) =>
        oldUser ? data.user : oldUser,
      )
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  async function handleSubmitForm(data: ProfileFormSchemaType) {
    await updateProfileFn(data)
    reset()
  }

  return (
    <Box
      variant="outlined"
      component={Card}
      maxWidth={450}
      minWidth={300}
      padding={4}
      gap={2}
      overflow="auto"
    >
      <Box display="flex" justifyContent="center">
        <Badge
          overlap="circular"
          badgeContent={
            <>
              <IconButton size="large" sx={{ p: 0, color: 'text.secondary' }}>
                <Edit fontSize="large" />
              </IconButton>
            </>
          }
        >
          <Avatar
            alt={user?.name}
            src={user?.avatar_url ?? ''}
            sx={{
              width: 128,
              height: 128,
              fontSize: 64,
            }}
          />
        </Badge>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(handleSubmitForm)}
        display="flex"
        flexDirection="column"
        width="100%"
        gap={2}
      >
        <FormControl>
          <FormLabel htmlFor="name">Nome</FormLabel>
          <TextField
            size="small"
            id="name"
            type="name"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message ?? ''}
            {...register('name')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="last_name">Sobrenome</FormLabel>
          <TextField
            size="small"
            id="last_name"
            type="last_name"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.last_name}
            helperText={errors.last_name?.message ?? ''}
            {...register('last_name')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            size="small"
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
            {...register('email')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="new_password">Nova senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="password"
            id="new_password"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.new_password}
            helperText={errors.new_password?.message ?? ''}
            {...register('new_password')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="repeat_password">Repetir nova senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="password"
            id="repeat_password"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.repeat_password}
            helperText={errors.repeat_password?.message ?? ''}
            {...register('repeat_password')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="password"
            id="password"
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message ?? ''}
            {...register('password')}
          />
        </FormControl>
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          disabled={isPending}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  )
}
