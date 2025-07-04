import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'  
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../context/AlertContext'
import { users } from '../../api/users'
import { Card } from '../../components/Card'

export const CreateAccountFormSchema = z
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

    repeat_password: z
      .string()
      .trim()
      .min(1, { message: 'Este campo não pode ficar vazio' }),
  })
  .refine((data) => data.password === data.repeat_password, {
    path: ['repeat_password'],
    message: 'As senhas não coincidem',
  })

type CreateAccountFormSchemaType = z.infer<typeof CreateAccountFormSchema>

export function CreateAccount() {
  const { error, success } = useContext(AlertContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateAccountFormSchemaType>({
    resolver: zodResolver(CreateAccountFormSchema),
  })

  const { mutateAsync: registerFn, isPending } = useMutation({
    mutationFn: async ({
      name,
      last_name,
      email,
      password,
    }: CreateAccountFormSchemaType) =>
      await users.register({ name, last_name, email, password }),
    onSuccess: (data) => {
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  async function handleSubmitForm(data: CreateAccountFormSchemaType) {
    await registerFn(data)
    reset()
  }

  function handleDoLogin() {
    navigate('/login')
  }

  return (
    <Box
      variant="outlined"
      component={Card}
      maxWidth={450}
      minWidth={300}
      padding={4}
      gap={2}
    >
      <Typography component="h1" variant="h4">
        Criar conta
      </Typography>
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
            required
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
            required
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
            required
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
            {...register('email')}
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
            required
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message ?? ''}
            {...register('password')}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="repeat_password">Repetir senha</FormLabel>
          <TextField
            size="small"
            placeholder="••••••"
            type="password"
            id="repeat_password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.repeat_password}
            helperText={errors.repeat_password?.message ?? ''}
            {...register('repeat_password')}
          />
        </FormControl>
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          disabled={isSubmitting || isPending}
        >
          CRIAR
        </Button>
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleDoLogin}
        >
          FAZER LOGIN
        </Button>
      </Box>
    </Box>
  )
}
