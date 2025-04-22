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

The **WizeWorks GraphQL API** is a multi-tenant, Supabase-backed API built with **Fastify**, **Mercurius**, and modern tooling for observability and traceability via **Sentry**.

> This API is designed to serve as a backend foundation for WizeWorks SaaS apps.

---

## 🔧 Tech Stack

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

### 2. Kubernetes Deployment

This repo includes production-ready Kubernetes manifests in the `deployment/` folder.

```bash
kubectl apply -f deployment/deployment.yaml
kubectl apply -f deployment/service.yaml
kubectl apply -f deployment/ingress.yaml
```

---

### 3. GitHub Actions (CI/CD)

GitHub Actions will auto-deploy on push to `main`.

You’ll need to configure the following secrets in your GitHub repository:

| Secret Name         | Description                                 |
|---------------------|---------------------------------------------|
| `AKS_CLUSTER`       | AKS Cluster Name                            |
| `ACR_NAME`          | Container registry URL                      |
| `IMAGE_NAME`        | Image name (`e.g., wize-example`)           |
| `SUPABASE_URL`      | Supabase URL                                |
| `SUPABASE_KEY`      | Supabase Key                                |
| `SENTRY_DSN`        | Sentry DSN                                  |

You can customize these in `.github/workflows/deploy.yml`.

---

### 🔁 Commit Versioning Requirement

Before pushing commits to `development`, apply a version bump using one of the following:

```bash
npm run patchversion   # For patches
npm run minorversion   # For minor feature additions
npm run majorversion   # For breaking changes
```

This ensures semantic versioning is maintained via the `version` field in `package.json`.

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
