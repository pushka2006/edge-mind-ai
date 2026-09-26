# EDGE MIND AI
### AI-Powered Edge Memory & Intelligence Platform

> **"Local intelligence. Persistent memory. Cloud synchronization."**

**EDGE MIND AI** is an enterprise-grade, offline-first AI platform that allows applications to remember, search, reason over, and operate on information directly on edge devices without continuously depending on cloud connectivity.

Built for **robots, CNC machining cells, industrial systems, autonomous drones, smart kiosks, and emergency remote infrastructure**, EDGE MIND AI implements an edge-first memory architecture:

- **Local Qdrant Edge Vector Storage**: Sub-millisecond similarity search on-device.
- **Offline Intelligence**: Full search, memory capture, and EdgeMind AI reasoning when the internet drops.
- **Priority-Driven Delta Sync**: Efficient synchronization to Qdrant Cloud when connectivity returns.
- **Conflict Center**: Multi-master consensus detection and resolution (Keep Local, Keep Cloud, Merge & Synthesize).
- **Interactive 11-Step Edge-to-Cloud Demonstration**: Built-in visual demo simulating industrial machine monitoring.

---

## Key Features

1. **Local Semantic Memory**: 128-dimensional dense vector embeddings indexed on-device with cosine distance.
2. **Hybrid Retrieval**: Blends vector similarity with keyword BM25 scoring and metadata filters (Device, Type, Sensitivity).
3. **Simulate Offline Mode Toggle**: High-visibility switch to test edge autonomy and queue accumulation.
4. **EdgeMind Conversational Assistant**: Offline RAG assistant citing verified memory IDs (`[M-1024]`, `[M-1025]`).
5. **Memory Inspector & Version History**: Full version control, quality metrics, and vector preview.
6. **Topological Memory Graph**: Visual network connecting machines, telemetry spikes, maintenance logs, and cloud replicas.
7. **Multi-Device Fleet Monitoring**: 5 industrial edge devices with live CPU, RAM, storage, and thermal telemetry.
8. **Automated Conflict Resolution**: Side-by-side local vs cloud diffs with 3 automated/manual resolution strategies.
9. **Zero-Leakage Privacy Policies**: Configurable routing rules (`LOCAL_ONLY`, `HIGH_PRIORITY_SYNC`, `LOCAL_WITH_EXPIRATION`).
10. **Immutable Cryptographic Audit Trail**: Full recording of searches, memory writes, delta syncs, and conflict decisions.

---

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts.
- **Storage Abstraction Layer**: `MemoryStore` ➔ `EdgeMemoryStore` (on-device Qdrant Edge) + `CloudMemoryStore` (Qdrant Server).
- **AI & Embeddings**: Deterministic 128-dim dense semantic vector engine + EdgeMind local/cloud model router.
- **Enterprise Design**: Deep obsidian dark mode (`#080a0f`), copper/amber accents (`#f97316`), glassmorphism panels, and fine grid lines.

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/pushka2006/cybersecurity-attack-visualizer.git
cd edgememory
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Edge Mind AI platform.

---

## Interactive Edge-to-Cloud Demo

Click the **"Run Edge Demo"** button in the top navigation bar to execute the 11-step industrial scenario:

1. **Online Baseline**: Machine Edge #01 active and calibrated.
2. **Capture Memory**: Logs baseline thermal memory (`M-2001`).
3. **Local Vector Search**: Instant query via on-device Qdrant Edge.
4. **Disconnect Network**: Engages offline mode simulation.
5. **Offline Capture**: Logs critical vibration harmonic spike (`M-2002`).
6. **Search While Offline**: Semantic retrieval functions with 0% network access.
7. **Reconnect Network**: Restores connectivity to Qdrant Cloud.
8. **Delta Synchronization**: Priority queue flushes to cloud.
9. **Conflict Detected**: Detects thermocouple drift on `M-1024`.
10. **Resolve Conflict**: Applies "Synthesize & Merge" strategy.
11. **Verified Consensus**: 100% agreement between edge and cloud!

---

## REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/memories` | GET / POST | List all memories or create a new memory item |
| `/api/memories/[id]` | GET / PATCH / DELETE | Retrieve, update version, or remove a memory |
| `/api/search` | POST | Hybrid, local, or cloud semantic vector search |
| `/api/sync/status` | GET | Retrieve queue status, sync percentage, and events |
| `/api/sync/start` | POST | Trigger delta synchronization with Qdrant Cloud |
| `/api/sync/toggle-offline` | POST | Toggle offline resilience simulation |
| `/api/conflicts` | GET | List unresolved and resolved sync conflicts |
| `/api/conflicts/[id]/resolve` | POST | Resolve conflict (KEEP_LOCAL, KEEP_CLOUD, MERGE) |
| `/api/devices` | GET / POST | Fleet hardware telemetry and device registration |
| `/api/analytics` | GET | Ingestion curves, type distributions, and latency percentiles |
| `/api/audit-logs` | GET | Immutable system audit log trail |
| `/api/ai/chat` | POST | EdgeMind RAG query reasoning endpoint |
| `/api/demo/scenario` | POST | 11-step interactive demo scenario driver |

---

## License
MIT License. Built for resilient, offline-first intelligent edge systems.
