# rag-istae-web

Interfaz web del sistema conversacional de consulta sobre la normativa
institucional y nacional del Instituto Superior Tecnológico Alberto Enríquez
(ISTAE). Trabajo de titulación de la Maestría en Inteligencia Artificial
Aplicada (UIDE), Grupo 3.

## Qué hace

- Chat de consulta normativa con la respuesta mostrada a medida que llega.
- Citas numeradas dentro del texto: al hacer clic se abre el artículo completo
  tal como figura en la norma.
- Panel plegable «Fuentes legales» con una tarjeta por artículo citado, la cita
  textual y si se verificó contra la norma.
- Botón «Nuevo chat» para empezar una conversación sin el contexto anterior.

Pendiente: inicio de sesión e historial de chats por usuario.

La interfaz no contiene lógica de recuperación ni de generación: consume la API
del backend (`rag-istae-api`), que responde con las arquitecturas RAG B (híbrido)
y C (con jerarquía normativa). Cada conversación trata un solo tema.

## Estructura

```
src/
  app/                    página, layout e ícono
  components/chat/        pantalla de chat: mensajes, citas, fuentes y artículo
  components/layout/      barra lateral, logo del ISTAE y modo claro/oscuro
  components/ui/          componentes base de shadcn/ui
  hooks/useChat.ts        estado del chat
  lib/api.ts              llamadas al backend (POST /chat, GET /architectures)
  lib/citations.ts        numeración de citas
  lib/types.ts            tipos del contrato con el backend
```

## Tecnologías

- Next.js 16 (App Router) con TypeScript
- Tailwind CSS 4 (con @tailwindcss/typography); paleta institucional en `src/app/globals.css`
- shadcn/ui sobre Radix (componentes en `src/components/ui/`), motion (animaciones), next-themes (modo oscuro)
- react-markdown, eventsource-parser, SWR, lucide-react
- Despliegue: Vercel (plan Hobby)

## Desarrollo local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Variables de entorno (ver `.env.example`):

- `NEXT_PUBLIC_API_URL`: la URL del backend (por defecto http://localhost:8000).
- `ACCESS_PASSWORD`: contraseña compartida para entrar a la web. Sin la cookie de
  acceso, cualquier página lleva a `/acceso`, donde se ingresa la clave; el navegador
  la recuerda 7 días. Es obligatoria en producción: sin ella el sitio responde 503.
  En `npm run dev` es opcional. Archivos: `src/proxy.ts`, `src/app/acceso` y
  `src/app/api/acceso`.

## Repositorios relacionados

- `rag-istae-api`: backend (FastAPI)
- `rag-istae-ingestion`: extracción y preparación de los documentos
- `rag-istae-query`: arquitecturas evaluadas y scripts de evaluación
