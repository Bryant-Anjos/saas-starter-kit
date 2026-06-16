import { z } from 'zod'

const flag = z.enum(['true', 'false']).transform(v => v === 'true')

const base = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_PROVIDER: z.enum(['sqlite', 'postgres']).default('sqlite'),
  DATABASE_URL: z.string().optional(),
  DATABASE_PATH: z.string().optional(),

  // Web / CORS
  WEB_URL: z.string().url().default('http://localhost:5173'),

  // Email
  EMAIL_FROM: z.string().default('noreply@starter.local'),
  EMAIL_HTTP_URL: z.string().url().optional(),
  EMAIL_HTTP_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Auth
  MAGIC_LINK_EXPIRY_MINUTES: z.coerce.number().default(15),

  // Feature flags
  ENABLE_AUTH: flag.default('true'),
  ENABLE_REGISTRATION: flag.default('true'),

  // App
  PORT: z.coerce.number().default(3001),
  MAINTENANCE_MODE: flag.default('false'),
})

const prodRefinements = base.superRefine((env, ctx) => {
  if (env.DATABASE_PROVIDER === 'postgres' && !env.DATABASE_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['DATABASE_URL'],
      message: 'DATABASE_URL is required when DATABASE_PROVIDER=postgres',
    })
  }

  if (!env.EMAIL_HTTP_URL && !env.SMTP_HOST) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['EMAIL_HTTP_URL'],
      message:
        'Email transport not configured: set EMAIL_HTTP_URL + EMAIL_HTTP_KEY (Resend / HTTP) or SMTP_HOST (SMTP)',
    })
  }

  if (env.EMAIL_HTTP_URL && !env.EMAIL_HTTP_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['EMAIL_HTTP_KEY'],
      message: 'EMAIL_HTTP_KEY is required when EMAIL_HTTP_URL is set',
    })
  }

  if (env.EMAIL_FROM === 'noreply@starter.local') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['EMAIL_FROM'],
      message: 'EMAIL_FROM must be set to a verified sender address in production',
    })
  }

  if (env.WEB_URL === 'http://localhost:5173') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['WEB_URL'],
      message: 'WEB_URL must be set to the production frontend URL (e.g. https://your-app.example.com)',
    })
  }
})

const schema = process.env.NODE_ENV === 'production' ? prodRefinements : base

const result = schema.safeParse(process.env)

if (!result.success) {
  console.error('\nEnvironment validation failed:\n')
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    console.error(`  ${path ? `[${path}] ` : ''}${issue.message}`)
  }
  console.error('\nFix the above environment variables and restart.\n')
  process.exit(1)
}

export const env = result.data
