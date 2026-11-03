# rag-istae-web

Interfaz web del sistema conversacional de consulta sobre la normativa
institucional y nacional del Instituto Superior Tecnológico Alberto Enríquez
(ISTAE). Trabajo de titulación de la Maestría en Inteligencia Artificial
Aplicada (UIDE), Grupo 3.

## Qué hace

- Inicio de sesión de estudiantes, docentes y administradores.
- Chat de consulta normativa con respuestas citadas: cada afirmación lleva el
  identificador del artículo y la sección «Fuentes» agrupa las citas por
  documento con su nombre oficial.
- Panel de documentos (consulta del catálogo; la subida de normas es la
  segunda etapa).

La interfaz no contiene lógica de recuperación ni de generación: consume la API
del backend (`rag-istae-api`), que expone la arquitectura elegida en la
evaluación (contexto largo o RAG) detrás del mismo endpoint.

## Tecnologías

- Next.js 16 (App Router) con TypeScript
- Tailwind CSS 4
- Despliegue previsto: Vercel (plan Hobby)

## Desarrollo local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Las variables de entorno (URL del backend, claves públicas del servicio de
autenticación) irán en `.env.local`, que no se sube al repositorio. El archivo
`.env.example` documenta cuáles son.

## Repositorios relacionados

- `rag-istae-api`: backend (FastAPI)
- `rag-istae-ingestion`: extracción y preparación de los documentos
- `rag-istae-query`: arquitecturas evaluadas y scripts de evaluación
