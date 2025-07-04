import { Box, CircularProgress } from '@mui/material'
import logo from '../../assets/quantum.svg'

export function Loading() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
      <Box component="img" src={logo} alt="logo da ufsc" height={'32rem'} />
      <CircularProgress size={'7.875rem'} color="inherit" />
    </Box>
  )
}
