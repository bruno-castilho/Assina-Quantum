import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  Paper,
  Divider,
} from '@mui/material'
import { useContext, useState } from 'react'
import { signatures } from '../../api/signatures'
import { AlertContext } from '../../context/AlertContext'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function Home() {
  const [verifyFile, setVerifyFile] = useState<File | null>(null)
  const [verifySign, setVerifySign] = useState<File | null>(null)

  const [signFile, setSignFile] = useState<File | null>(null)
  const [signKey, setSignKey] = useState<File | null>(null)

  const { error, success } = useContext(AlertContext)


  const { mutateAsync: signDocumentFn, isPending: isPendingSignDocument } = useMutation({
    mutationFn: async ({form}: {form: FormData}) =>
      await signatures.signDocument({
        form
      }),

    onSuccess: (file) => {
      const url = URL.createObjectURL(file)

      const a = document.createElement('a')
      a.href = url
      a.download = 'signature.json'
      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      success('Documento assinado com sucesso')
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const { mutateAsync: verifySignFn, isPending: isPendingVerify } = useMutation({
    mutationFn: async ({form}: {form: FormData}) =>
      await signatures.verifySign({
        form
      }),

    onSuccess: (data) => {
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  async function  handleVerify() {
    if (!verifyFile || !verifySign) return


    const form = new FormData();
    form.append('document', verifyFile)
    form.append('signature', verifySign)

    await verifySignFn({
      form
    })

  }

  async function handleSign() {
    if (!signFile || !signKey ) return

    const form = new FormData();
    form.append('document', signFile)
    form.append('secret_key', signKey)

    await signDocumentFn({
      form
    })
  }

  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Stack
          spacing={4}
          direction={{ xs: 'column', md: 'row' }}
          alignItems="stretch"
          justifyContent="center"
        >
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Verificar Assinatura
              </Typography>
              <Typography variant="body1" textAlign="center">
                Selecione o documento e a assinatura para validar a assinatura digital.
              </Typography>

              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="verify-upload-document"
                type="file"
                onChange={(e) =>
                  setVerifyFile(e.target.files?.[0] || null)
                }
              />
              <label htmlFor="verify-upload-document">
                <Button variant="outlined" component="span">
                  {verifyFile ? 'Trocar Documento' : 'Selecionar Documento'}
                </Button>
              </label>

              {verifyFile && (
                <Typography variant="body2" color="text.secondary">
                  Arquivo: {verifyFile.name}
                </Typography>
              )}

              <input
                accept=".json"
                style={{ display: 'none' }}
                id="verify-upload-sign"
                type="file"
                onChange={(e) =>
                  setVerifySign(e.target.files?.[0] || null)
                }
              />
              <label htmlFor="verify-upload-sign">
                <Button variant="outlined" component="span">
                  {verifySign ? 'Trocar Assinatura' : 'Selecionar Assinatura'}
                </Button>
              </label>

              {verifySign && (
                <Typography variant="body2" color="text.secondary">
                  Arquivo: {verifySign.name}
                </Typography>
              )}


              <Divider sx={{ width: '100%' }} />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleVerify}
                disabled={!verifyFile || !verifySign}
                loading={isPendingVerify}
              >
                Verificar Assinatura
              </Button>
            </Stack>
          </Paper>
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Assinar Documento
              </Typography>
              <Typography variant="body1" textAlign="center">
                Selecione o documento e a chave privada para gerar a assinatura digital.
              </Typography>

              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="sign-upload-document"
                type="file"
                onChange={(e) =>
                  setSignFile(e.target.files?.[0] || null)
                }
              />
              <label htmlFor="sign-upload-document">
                <Button variant="outlined" component="span">
                  {signFile ? 'Trocar Documento' : 'Selecionar Documento'}
                </Button>
              </label>

              {signFile && (
                <Typography variant="body2" color="text.secondary">
                  Arquivo: {signFile.name}
                </Typography>
              )}

              <input
                accept=".sec"
                style={{ display: 'none' }}
                id="sign-upload-key"
                type="file"
                onChange={(e) =>
                  setSignKey(e.target.files?.[0] || null)
                }
              />
              <label htmlFor="sign-upload-key">
                <Button variant="outlined" component="span">
                  {signKey ? 'Trocar chave' : 'Selecionar chave privada'}
                </Button>
              </label>

              {signKey && (
                <Typography variant="body2" color="text.secondary">
                  Arquivo: {signKey.name}
                </Typography>
              )}

              <Divider sx={{ width: '100%' }} />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleSign}
                disabled={!signFile || !signKey}
                loading={isPendingSignDocument}
              >
                Assinar Documento
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  )
}
