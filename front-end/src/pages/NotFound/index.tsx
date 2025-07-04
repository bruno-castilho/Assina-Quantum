import { Box, Button, Typography } from '@mui/material'
import logo from '../../assets/quantum.svg'
import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
      <Box
        component="img"
        src={logo}
        alt="Logo da UFSC"
        height={'32rem'}
        sx={{ maxWidth: '90%' }}
      />
      <Typography variant="h4" component="h1" textAlign="center">
        Página não encontrada
      </Typography>
      <Typography variant="body1" textAlign="center">
        Parece que a página que você está procurando não existe.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Voltar para a página inicial
      </Button>
    </Box>
  )
}
