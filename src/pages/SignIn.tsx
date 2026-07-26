import { useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from '@heroui/react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { authApi } from '@/services/auth'
import { useAuthStore } from '@/store/useAuthStore'

interface SignInForm {
  email: string
  password: string
}

export function SignIn() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: { email: '', password: '' },
  })

  useGSAP(
    () => {
      gsap.fromTo(
        '.signin-field',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
    },
    { scope: ref }
  )

  const onSubmit = async (data: SignInForm) => {
    try {
      const tokens = await authApi.login({
        email: data.email,
        password: data.password,
      })
      setAccessToken(tokens.accessToken)
      navigate('/home')
    } catch {
      setError('root', { message: 'Invalid email or password.' })
    }
  }

  const handleGoogle = async (code: string) => {
    try {
      const tokens = await authApi.google({ code })
      setAccessToken(tokens.accessToken)
      navigate('/home')
    } catch {
      setError('root', { message: 'Google sign-in failed. Please try again.' })
    }
  }

  return (
    <AuthLayout>
      <div ref={ref}>
        <h1 className="text-3xl font-normal tracking-tight text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink/50">
          New to Slate?{' '}
          <Link to="/register" className="font-medium text-brand-bright underline-offset-2 hover:underline">
            Create an account
          </Link>
        </p>

        <div className="signin-field mt-8">
          <GoogleAuthButton
            onSuccess={handleGoogle}
            isLoading={isSubmitting}
          />
        </div>

        <div className="signin-field my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-xs text-ink/35">or</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="signin-field">
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  isRequired
                  type="email"
                  isInvalid={!!errors.email}
                  className="w-full"
                >
                  <Label className="text-xs font-medium uppercase tracking-wide text-ink/50">
                    Email
                  </Label>
                  <Input
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl ring-accent border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.email?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          <div className="signin-field">
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  isRequired
                  type="password"
                  isInvalid={!!errors.password}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium uppercase tracking-wide text-ink/50">
                      Password
                    </Label>
                  </div>
                  <Input
                    placeholder="Your password"
                    className="mt-1.5 w-full rounded-xl ring-accent border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.password?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          {errors.root && (
            <p className="signin-field rounded-xl bg-brand-bright/8 px-4 py-3 text-sm text-brand-bright">
              {errors.root.message}
            </p>
          )}

          <div className="signin-field pt-2">
            <Button
              type="submit"
              size="lg"
              isDisabled={isSubmitting}
              className="w-full rounded-xl bg-ink font-semibold text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </Form>
      </div>
    </AuthLayout>
  )
}