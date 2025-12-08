# Standardized Error Handling

This document defines the patterns for handling errors in the RutaLink application to ensure a consistent user experience and developer workflow.

## 1. Server Actions

All Server Actions must return a standardized response object and strictly avoid throwing errors to the client, except for redirecting (which uses `throw` internally in Next.js).

### Response Interface

```typescript
export type ActionState<T = any> = {
  success: boolean
  error?: string
  data?: T
  fieldErrors?: Record<string, string[]> // For form validation errors
}
```

### Pattern

```typescript
'use server'

export async function myAction(formData: FormData): Promise<ActionState> {
  try {
    // 1. Validation
    const validated = schema.safeParse(formData)
    if (!validated.success) {
      return { success: false, error: 'Datos inválidos', fieldErrors: validated.error.flatten().fieldErrors }
    }

    // 2. Logic (Supabase calls, etc.)
    const { error } = await supabase.from('...').insert(...)
    
    // 3. Handle Database Errors
    if (error) {
      console.error('Database Error:', error) // Log technical details on server
      return { success: false, error: 'Error al guardar los datos.' } // Generic message to user
    }

    // 4. Success
    return { success: true, data: ... }

  } catch (err) {
    // 5. Catch Unexpected Errors
    console.error('Unexpected Error:', err)
    return { success: false, error: 'Ocurrió un error inesperado.' }
  }
}
```

## 2. Client-Side Handling

Use `sonner` (via `toast`) to feedback the result to the user.

```tsx
'use client'

import { toast } from 'sonner'

export function MyComponent() {
  const handleSubmit = async (formData: FormData) => {
    const result = await myAction(formData)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Operación exitosa')
  }

  return <form action={handleSubmit}>...</form>
}
```

## 3. Critical Errors

For errors that render a page unusable (e.g., failed to fetch critical data in `page.tsx`), use Next.js `error.tsx` boundaries.

- Throwing an error in a Server Component triggers `error.tsx`.
- Use `notFound()` for missing resources (404).

## 4. Logging

- **Development**: Console errors are sufficient.
- **Production**: Critical errors (500s) should eventually be sent to a monitoring service (e.g., Sentry). Currently, we rely on Vercel Logs.
