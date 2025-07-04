import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from './Header'
import { Box } from '@mui/material'
import { useContext } from 'react'
import { AlertContext } from '../../context/AlertContext'
import { useQuery } from '@tanstack/react-query'
import { authenticate } from '../../api/authenticate'
import { Loading } from '../../components/Loading'

export function DefaultLayout() {
  const navigate = useNavigate()
  const { success } = useContext(AlertContext)
  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { user, message } = await authenticate.logged()
      success(message)
      return user
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  })
  if (!user && isLoading) {
    return (
      <Box
        component="main"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Loading />
      </Box>
    )
  }
  if (isError) navigate('/login')
  if (!user) return <></>
  return (
    <>
      <Header />
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="85vh"
        margin={2}
      >
        <Outlet />
      </Box>
    </>
  )
}
