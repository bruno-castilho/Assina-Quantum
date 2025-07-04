import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  Paper,
  IconButton,
} from '@mui/material'
import { Delete, AddCircleOutline } from '@mui/icons-material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { certificate } from '../../api/certificates'
import { useContext } from 'react'
import { AlertContext } from '../../context/AlertContext'
import axios from 'axios'
import { queryClient } from '../../lib/react-query'
import type { Certificate } from '../../@types/certificate'

export function Certificates() {

  const { error, success } = useContext(AlertContext)

    const { mutateAsync: createFn, isPending: isPendingCreate } = useMutation({
    mutationFn: async () =>
      await certificate.createCertificate(),
    onSuccess: (file) => {
      const url = URL.createObjectURL(file)

      const a = document.createElement('a')
      a.href = url
      a.download = 'secret_key.sec'
      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      success('Certificado criado com sucesso')
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })



    const { mutateAsync: removeFn, isPending: isPendingRemove } = useMutation({
    mutationFn: async ({ certificateId }: {
      certificateId: string
    }) =>
      await certificate.removeCertificate({ certificateId}),
    onSuccess: (data) => {
      queryClient.setQueryData<Certificate | null>(['mycertificate'], () => null)
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })


  const { data, isPending: isPendingFetch } = useQuery({
    queryKey: ['mycertificate'],
    queryFn: () =>
      certificate.myCertificate(),
  })


  async function handleCreate(){
    await createFn()
  }

  async function handleRemove(certificateId: string) {
    await removeFn({
      certificateId
    })
  }



  return (
    <Container maxWidth="md">
      <Box py={6}>
        <Stack spacing={4}>
          <Typography variant="h4" fontWeight="bold" textAlign="center">
            Meus Certificados
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            onClick={handleCreate}
            disabled={isPendingFetch || !!data?.certificate}
            loading={isPendingCreate}
          >
            Gerar Certificado
          </Button>

          {!data?.certificate ? (
            <Typography textAlign="center" color="text.secondary">
              Nenhum certificado encontrado.
            </Typography>
          ) : (
            <Paper key={data.certificate.id} elevation={2} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {`${data.certificate.owner.name} ${data.certificate.owner.last_name}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emitido em: {new Date(data.certificate.valid_from).toDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Válido até: {new Date(data.certificate.valid_to).toDateString()}
                  </Typography>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemove(data.certificate.id)}
                  title="Remover certificado"
                  loading={isPendingRemove}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          )}

        </Stack>
      </Box>
    </Container>
  )
}
