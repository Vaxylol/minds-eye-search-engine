# Mind's Eye Search Engine (Google-Native)

**Mind's Eye Search Engine** is the search + stats microservice for the
Google-native Mind's Eye OS constellation.

It powers:

- `GET /events/search` – find events by text, source, kind, time window.
- `GET /events/stats` – aggregate simple counts over time blocks/segments.

This service is designed to sit behind Cloud Run / Cloud Functions and
index events that have already been normalized by **minds-eye-core**
(using the LAW-T event model).

Typical flow in the Google-native stack:

1. Google Workspace (Gmail, Calendar, Drive, Docs, Meet, Android)
2. `minds-eye-gworkspace-connectors` – ingest + normalize into `MindEyeEvent`
3. Mind's Eye storage (DB or event store)
4. `minds-eye-search-engine` – search + stats over those events
5. `minds-eye-dashboard` – UI that calls `/events/search` + `/events/stats`

---

## 🧠 Core Responsibilities

- Full-text + simple trigram-style search helpers.
- Filtered search by:
  - source (`gmail`, `calendar`, `drive`, etc.)
  - kind (`gmail.message`, `calendar.event`, etc.)
  - time window (LAW-T blocks/segments or raw timestamps).
- Stats endpoints that:
  - count events per day (`blockId`)
  - count events per source
  - support basic timeline metrics.

This repo does **not** own storage. It expects to read events from
whatever backing store you choose (Postgres, Firestore, BigQuery, etc.)
or in-memory during prototyping.

---

## 🚀 Quick Start (Local Dev)

Install dependencies:

```bash
npm install
npm run build
npm start   # if you add a start script later, or run via ts-node
