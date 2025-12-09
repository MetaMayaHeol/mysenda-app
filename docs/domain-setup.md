# Configuración de Dominio (Vercel + Cloudflare)

Guía para configurar `mysenda.com` en Vercel utilizando Cloudflare como DNS (recomendado para seguridad y velocidad).

## Paso 1: Vercel (Agregar Dominio)

1. Ve a tu proyecto en **Vercel**.
2. Navega a **Settings** > **Domains**.
3. Ingresa `mysenda.com` y haz clic en **Add**.
4. Vercel te mostrará unos registros DNS necesarios (generalmente un CNAME o A Record).
   - **Registro A**: `76.76.21.21` (recomendado para el dominio raíz).
   - **Registro CNAME**: `cname.vercel-dns.com` (para `www`).

## Paso 2: Cloudflare (DNS)

1. Si compraste el dominio en otro lugar (Namecheap, GoDaddy), apunta los **Nameservers** a Cloudflare.
2. En el panel de **Cloudflare**, ve a **DNS**.
3. Agrega los registros que te dió Vercel:

   | Tipo | Nombre | Contenido (Valor) | Proxy (Nube Naranja) |
   |------|--------|-------------------|----------------------|
   | A    | @      | 76.76.21.21       | **Proxied** (Naranja) |
   | CNAME| www    | cname.vercel-dns.com | **Proxied** (Naranja) |

   > **Nota**: Al usar Cloudflare "Proxied" (Nube Naranja), debes configurar el modo SSL/TLS en Cloudflare a **Full (Strict)** para evitar errores de "Too many redirects".

## Paso 3: Configuración SSL (Importante)

1. En **Cloudflare** > **SSL/TLS** > **Overview**.
2. Cambia el modo a **Full (Strict)**.
   - Esto asegura que la conexión entre Cloudflare y Vercel esté encriptada y valida el certificado de Vercel.

## Paso 4: Vercel (Environment Variables)

Una vez que el dominio esté activo:

1. Ve a **Vercel** > **Settings** > **Environment Variables**.
2. Busca `NEXT_PUBLIC_APP_URL`.
3. Edítala (o agrégala) con el valor: `https://mysenda.com` (sin barra final).
4. **Redespliega** (Redeploy) tu proyecto para que los cambios surtan efecto en el sitemap y metadatos.

## Verificación

Visita `https://mysenda.com`. Deberías ver tu sitio con el candado SSL seguro.
