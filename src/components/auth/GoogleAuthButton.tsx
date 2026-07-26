import { useGoogleLogin } from '@react-oauth/google'
import { Icon } from '@iconify/react'

interface GoogleAuthButtonProps {
  onSuccess: (code: string) => void
  isLoading?: boolean
}

export function GoogleAuthButton({ onSuccess, isLoading }: GoogleAuthButtonProps) {
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (response) => onSuccess(response.code),
    onError: () => console.error('Google login failed'),
  })

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={isLoading}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper/80 disabled:opacity-50"
    >
      <Icon icon="flat-color-icons:google" className="text-xl" />
      Continue with Google
    </button>
  )
}