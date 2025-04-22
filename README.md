# @wizeworks/graphql-factory 🚀

[![CI](https://img.shields.io/github/actions/workflow/status/wize-works/graphql-factory/publish.yml?label=CI&style=flat-square)](https://github.com/wize-works/graphql-factory/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/wize-works/graphql-factory?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/wize-works/graphql-factory?style=flat-square)](https://github.com/wize-works/graphql-factory/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/wize-works/graphql-factory/pulls)
[![GraphQL](https://img.shields.io/badge/graphql-powered-E10098.svg?style=flat-square&logo=graphql&logoColor=white)](https://graphql.org)
[![Supabase](https://img.shields.io/badge/backend-supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

---

## ✨ Overview

`@wizeworks/graphql-factory` is a GraphQL schema generator optimized specifically for building **multi-tenant Supabase-backed APIs**. It auto-generates GraphQL object types, input types, filters, sorters, and resolvers from simple metadata models.

> **Note:** This package is intentionally opinionated and tightly coupled to Supabase. It assumes you're using PostgREST features like `RLS`, `set_config`, and `rpc`.

---

## 🔧 Features

- 🏗️ Auto-generate GraphQL types from metadata
- 🔍 Advanced filter/sort/paging support
- 🔁 Subscription-ready schema extension
- 🔐 Multi-tenant query isolation via RLS
- 🔗 Works great with Supabase + Mercurius
- 🎯 Designed for TypeScript-first GraphQL services

---

## 📦 Install

```bash
npm install @wizeworks/graphql-factory
```

---

## 📄 Usage

```ts
import { getGraphQLTypesFor } from '@wizeworks/graphql-factory';

const model = {
  name: 'Example',
  fields: {
    id: { type: 'int', required: true },
    title: { type: 'string' },
    createdAt: { type: 'datetime' },
  }
};

const { type, input, filter, sort, paging } = getGraphQLTypesFor(model, 'Example');
```

Use the returned types to build your GraphQL schema, queries, and mutations dynamically.

---

## 🌐 Environment

This package expects your app to include:
- `.env` with `SUPABASE_URL` and `SUPABASE_KEY`
- A `utils/supabase.ts` or equivalent Supabase client

> ℹ️ You should load environment variables using [`dotenv`](https://www.npmjs.com/package/dotenv) or your preferred runtime loader **before importing and using this package**.

---

## 📚 License

MIT © [WizeWorks](https://github.com/wizeworks)
