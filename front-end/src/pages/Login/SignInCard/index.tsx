import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Link as LinkMUI,
} from '@mui/material'
import { useContext, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../context/AlertContext'

import { queryClient } from '../../../lib/react-query'

import ForgotPassword from '../../../components/ForgotPassword'
import { authenticate } from '../../../api/authenticate'
import { Card } from '../../../components/Card'

export const SignInFormSchema = z.object({
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
})

type SignInFormSchemaType = z.infer<typeof SignInFormSchema>

export function SignInCard() {
  const [open, setOpen] = useState(false)
  const { error, success } = useContext(AlertContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormSchemaType>({
    resolver: zodResolver(SignInFormSchema),
  })

  const { mutateAsync: loginFn, isPending } = useMutation({
    mutationFn: async ({ email, password }: SignInFormSchemaType) =>
      await authenticate.login({ email, password }),
    onSuccess: (data) => {
      success(data.message)
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  async function handleSubmitForm(data: SignInFormSchemaType) {
    await loginFn(data)
    reset()
    navigate('/perfil')
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
        Fazer login
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
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          size="small"
          fullWidth
          variant="contained"
          disabled={isSubmitting || isPending}
        >
          Entrar
        </Button>
        <LinkMUI
          component="button"
          type="button"
          onClick={handleClickOpen}
          variant="body2"
          alignSelf="center"
          color="secondary"
        >
          Esqueceu sua senha?
        </LinkMUI>
      </Box>
      <Divider>ou</Divider>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography textAlign="center">
          Não tem uma conta?{' '}
          <LinkMUI
            variant="body2"
            textAlign="center"
            component={Link}
            to="/cadastrar"
            color="secondary"
          >
            Inscrever-se
          </LinkMUI>
        </Typography>
      </Box>
    </Box>
  )
}
