import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  Typography,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import {  useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Folder, Home } from '@mui/icons-material'

interface Page {
  name: string
  route: string
  icon: ReactNode
}

const pages: Page[] = [
  {
    name: 'Início',
    route: '/inicio',
    icon: <Home fontSize="small" color="primary" />,
  },
  {
    name: 'Certificados',
    route: '/certificados',
    icon: <Folder fontSize="small" color="primary" />,
  },
]

export function PageMenu() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const location = useLocation()

  function handleOpenNavMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElNav(event.currentTarget)
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null)
  }

  const pathParts = location.pathname.split('/')

  return (
    <>
      <Box flexGrow={1} display={{ xs: 'flex', md: 'none' }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Box
          component={Menu}
          display={{ xs: 'block', md: 'none' }}
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
        >
          {pages.map((page) => (
            <MenuItem key={page.name} component={Link} to={page.route}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          ))}
        </Box>
      </Box>
      <Box flexGrow={1} display={{ xs: 'none', md: 'flex' }}>
        {pages.map((page) => (
          <Button
            key={page.name}
            component={Link}
            to={page.route}
            sx={{
              my: 2,
              display: 'block',
              color:
                pathParts[1] === page.route.split('/')[1]
                  ? 'secondary.main'
                  : 'text.primary',
            }}
          >
            {page.name}
          </Button>
        ))}
      </Box>
    </>
  )
}
