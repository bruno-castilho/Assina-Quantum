import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  InfoRounded,
  GroupRounded,
  MenuBookRounded,
  ConstructionRounded,
} from '@mui/icons-material'

import logo from '../../../assets/quantum.svg'
import { List, ListItem, ListItemText } from '@mui/material'

export function InformationContent() {
  return (
    <Stack
      flexDirection="column"
      alignSelf="center"
      gap={4}
      maxWidth={450}
      minWidth={300}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Box component="img" src={logo} alt="logo do projeto Assina@Quantum" height={48} />
        <Box display="flex" justifyContent="center">
          <Typography variant="h6" component="h1">
            Informações do Projeto
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" gap={2}>
        <InfoRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Sobre o Projeto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aplicação didática que simula uma Autoridade Certificadora (AC) para assinatura e verificação de documentos digitais com algoritmos pós-quânticos.
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <ConstructionRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Objetivos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Permitir que usuários gerem certificados digitais, assinem documentos e validem assinaturas, de forma simplificada e segura, com foco em criptografia pós-quântica.
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <MenuBookRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Disciplina
          </Typography>
          <Typography variant="body2" color="text.secondary">
            INE5429 – Segurança em Computação
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={2}>
        <GroupRounded />
        <Box>
          <Typography gutterBottom fontWeight="medium">
            Integrantes
          </Typography>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemText primary="Bruno da Silva Castilho" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Caio César Rodrigues de Aquino" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText primary="Marco Antônio Machado de Arruda" />
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Stack>
  )
}
