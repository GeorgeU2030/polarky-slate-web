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

interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export function Register() {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  useGSAP(
    () => {
      gsap.fromTo(
        '.register-field',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
    },
    { scope: ref }
  )

  const onSubmit = async (data: RegisterForm) => {
    try {
      const tokens = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      setAccessToken(tokens.accessToken)
      navigate('/home')
    } catch {
      setError('root', { message: 'Could not create account. Please try again.' })
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
        <h1 className="text-3xl font-normal tracking-tight text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-ink/50">
          Already have one?{' '}
          <Link to="/login" className="font-medium text-brand-bright underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>

        <div className="register-field mt-8">
          <GoogleAuthButton
            onSuccess={handleGoogle}
            isLoading={isSubmitting}
          />
        </div>

        <div className="register-field my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-xs text-ink/35">or</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="register-field">
            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Full name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  isRequired
                  isInvalid={!!errors.fullName}
                  className="w-full"
                >
                  <Label className="text-xs font-medium uppercase tracking-wide text-ink/50">
                    Full name
                  </Label>
                  <Input
                    placeholder="Jane Doe"
                    className="mt-1.5 w-full rounded-xl ring-accent border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.fullName?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          <div className="register-field">
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
                    className="mt-1.5 w-full rounded-xl border ring-accent border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.email?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          <div className="register-field">
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                validate: {
                  hasUpper: (v) => /[A-Z]/.test(v) || 'Must include an uppercase letter',
                  hasNumber: (v) => /[0-9]/.test(v) || 'Must include a number',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  isRequired
                  type="password"
                  isInvalid={!!errors.password}
                  className="w-full"
                >
                  <Label className="text-xs font-medium uppercase tracking-wide text-ink/50">
                    Password
                  </Label>
                  <Input
                    placeholder="Min. 8 characters"
                    className="mt-1.5 w-full rounded-xl ring-accent border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.password?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          <div className="register-field">
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  isRequired
                  type="password"
                  isInvalid={!!errors.confirmPassword}
                  className="w-full"
                >
                  <Label className="text-xs font-medium uppercase tracking-wide text-ink/50">
                    Confirm password
                  </Label>
                  <Input
                    placeholder="Repeat your password"
                    className="mt-1.5 w-full rounded-xl ring-accent border border-ink/15 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-ink/30 focus:outline-none"
                  />
                  <FieldError className="mt-1 text-xs text-brand-bright">
                    {errors.confirmPassword?.message}
                  </FieldError>
                </TextField>
              )}
            />
          </div>

          {errors.root && (
            <p className="register-field rounded-xl bg-brand-bright/8 px-4 py-3 text-sm text-brand-bright">
              {errors.root.message}
            </p>
          )}

          <div className="register-field pt-2">
            <Button
              type="submit"
              size="lg"
              isDisabled={isSubmitting}
              className="w-full rounded-xl bg-ink font-semibold text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </Form>

        <p className="register-field mt-6 text-center text-xs text-ink/35">
          By continuing, you agree to Slate's{' '}
          <a href="#" className="underline underline-offset-2">Terms</a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  )
}