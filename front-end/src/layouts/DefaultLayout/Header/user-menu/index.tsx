import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material'

import { useContext, useState } from 'react'
import { DarkMode, LightMode, Logout, Person } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'

import { queryClient } from '../../../../lib/react-query'
import { useMutation } from '@tanstack/react-query'
import { authenticate } from '../../../../api/authenticate'
import { AlertContext } from '../../../../context/AlertContext'
import axios from 'axios'
import type { User } from '../../../../@types/user'

export function UserMenu() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const { mode, systemMode, setMode } = useColorScheme()
  const user = queryClient.getQueryData<User>(['user'])
  const { error, success } = useContext(AlertContext)
  const navigate = useNavigate()

  const { mutateAsync: logoutFn, isPending } = useMutation({
    mutationFn: async () => await authenticate.logout(),
    onSuccess: (data) => {
      success(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e)) return error(e.response?.data.message)

      error('Algo não ocorreu bem')
    },
  })

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  function handleChangeMode() {
    setMode(mode === 'dark' || systemMode === 'dark' ? 'light' : 'dark')
    setAnchorElUser(null)
  }

  async function handleLogout() {
    await logoutFn()
    navigate('/login')
  }

  return (
    <Box flexGrow={0}>
      <Tooltip title="Menu do usuário">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0, color: 'text.primary' }}
        >
          <Avatar alt={user?.name} src={user?.avatar_url ?? ''} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem component={Link} to="/perfil">
          <ListItemIcon>
            <Person fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography textAlign="center">Perfil</Typography>
        </MenuItem>

        {(mode === 'light' || systemMode === 'light') && (
          <MenuItem onClick={handleChangeMode}>
            <ListItemIcon>
              <DarkMode fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">Habilitar Modo Escuro</Typography>
          </MenuItem>
        )}

        {(mode === 'dark' || systemMode === 'dark') && (
          <MenuItem onClick={handleChangeMode}>
            <ListItemIcon>
              <LightMode fontSize="small" color="primary" />
            </ListItemIcon>
            <Typography textAlign="center">Habilitar Modo Claro</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleLogout} disabled={isPending}>
          <ListItemIcon>
            <Logout fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography textAlign="center">Sair</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
