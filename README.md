# WizeWorks GraphQL API 🚀

[![CI](https://img.shields.io/github/actions/workflow/status/wize-works/graphql-factory/publish.yml?label=CI&style=flat-square)](https://github.com/wize-works/graphql-factory/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/wize-works/graphql-factory?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/wize-works/graphql-factory?style=flat-square)](https://github.com/wize-works/graphql-factory/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/wize-works/graphql-factory/pulls)
[![GraphQL](https://img.shields.io/badge/graphql-powered-E10098.svg?style=flat-square&logo=graphql&logoColor=white)](https://graphql.org)
[![Sentry](https://img.shields.io/badge/logged%20with-sentry-orange?style=flat-square&logo=sentry)](https://sentry.io)
[![Supabase](https://img.shields.io/badge/database-supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![npm](https://img.shields.io/npm/v/@wizeworks/graphql-factory?label=npm)](https://www.npmjs.com/package/@wizeworks/graphql-factory)

---

## ✨ Overview

`@wizeworks/graphql-factory` provides a dynamic, auto-generating GraphQL schema builder tailored for Supabase and PostgREST backends. It supports filtering, sorting, pagination, subscriptions, and multi-tenant authorization out of the box.

---

## 📦 Installation

```bash
npm install @wizeworks/graphql-factory
```

---

## 🔧 Usage

### 📁 1. Define Your Model
```ts
// src/models/comment.ts
import { GraphQLModel } from '@wizeworks/graphql-factory';

const CommentModel: GraphQLModel = {
  name: 'Comment',
  fields: {
    id: { type: 'uuid', required: true },
    postId: { type: 'string', required: true },
    content: { type: 'string', required: true },
    createdAt: { type: 'datetime', required: true },
    updatedAt: { type: 'datetime', required: true },
    // additional fields...
  }
};

export default CommentModel;
```

### ⚙️ 2a. Generate a Schema for One Model
```ts
import { getGraphQLSchemaForModel } from '@wizeworks/graphql-factory';
import CommentModel from './models/comment';

const schema = getGraphQLSchemaForModel(CommentModel, 'Comment');
```

### ⚙️ 2b. Load All Models from a Folder
```ts
import { buildUnifiedGraphQLSchemaFromFolder } from '@wizeworks/graphql-factory';
import path from 'path';

const schema = await buildUnifiedGraphQLSchemaFromFolder({
  modelPath: path.join(__dirname, './models'),
});
```
> 🔍 This will auto-import all `.ts` or `.js` model files in the folder and stitch them into a unified schema under a single GraphQL instance.


### 🚀 3. Environment Setup
Make sure the following environment variables are available at runtime:

Create a `.env` file based on `.env.example`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

| Tool             | Purpose                                   |
|------------------|-------------------------------------------|
| **Fastify**      | Blazing-fast Node.js web framework        |
| **Mercurius**    | GraphQL adapter for Fastify               |
| **Supabase**     | Postgres + Auth + RLS backend             |
| **Sentry**       | Error monitoring + transaction tracing    |
| **GraphQL Scalars** | Extended GraphQL support (DateTime, etc.) |
| **dotenv**       | Secure environment variable loading       |

---

## 🚀 Features

- ⚡ Fast and lightweight GraphQL API
- 🔐 Multi-tenant aware via RLS and `set_config`
- 📦 Supabase integration with typed data support
- 🧠 Rich GraphQL subscriptions using PubSub
- 📊 Full observability with scoped Sentry logging
- 🛡️ Fine-grained auth using custom scopes
- 🧪 Easy local development with `.env` and mock RLS
- 🧩 Unified schema generation with auto-discovery of models
- 🗂️ Filtering, sorting, and pagination built-in
- 🔁 Auto-generates full CRUD queries/mutations
- 🔍 Filtering (`_eq`, `_neq`, `_contains`, etc.)
- 🔃 Sorting and Pagination
- 🔐 Multi-tenant authorization via `context.tenantId`
- 📡 GraphQL Subscriptions via `graphql-subscriptions`
- 🧹 Unified schema with per-model modularity
- 🧪 Type-safe GraphQL generation with model-first design
- 📊 Sentry tracing integration

---

## 🏁 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/wize-works/graphql-factory.git
cd graphql-factory
npm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.example`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

### 3. Run the Dev Server

```bash
npm run dev
```

Access GraphQL Playground at:  
👉 `http://localhost:3000/graphiql`

---

## 📡 Example GraphQL Query

```graphql
query {
  listExamples(filter: { title_contains: "test" }, sort: { createdAt: desc }, paging: { limit: 10 }) {
    id
    title
    createdAt
  }
}
```

---

## 🚀 Deployment

### 1. Local Development

Run Node:

```bash
npm run dev
```

---

## ✍️ License

MIT © [WizeWorks](https://github.com/wize-works)

---

## 💡 Future Plans

- ⚙️ CLI for creating tenants & migrations
- 📘 Swagger/OpenAPI generation for REST proxying
- 🧩 Federation-ready module splitting
- 🔁 Live Supabase → PubSub bridge

---

## 🙏 Contributing

We welcome contributions! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.
