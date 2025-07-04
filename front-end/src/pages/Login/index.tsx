import { Divider, Stack } from '@mui/material'
import { InformationContent } from './InformationContent '
import { SignInCard } from './SignInCard'

export function Login() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      divider={
        <>
          <Divider orientation="vertical" flexItem />
          <Divider orientation="horizontal" flexItem />
        </>
      }
      spacing={4}
    >
      <InformationContent />
      <SignInCard />
    </Stack>
  )
}
