# EDGE MIND AI — Architecture Specification

> **Tagline:** "Local intelligence. Persistent memory. Cloud synchronization."  
> **Core Principle:** "THE EDGE SHOULD REMEMBER EVEN WHEN THE CLOUD CANNOT."

---

## 1. High-Level System Architecture

```
                    EDGE DEVICE
                         │
              ┌──────────┴──────────┐
              │                     │
        Local AI Runtime       Local Application
              │                     │
              └──────────┬──────────┘
                         │
                  EDGE MEMORY
                         │
                  QDRANT EDGE
                         │
              ┌──────────┼──────────┐
              │          │          │
          Vector      Metadata    Memory
          Search      Store       Manager
              │          │          │
              └──────────┼──────────┘
                         │
                 LOCAL AI ENGINE
                         │
                  Offline Search
                         │
                  Offline Reasoning
                         │
              ┌──────────┴──────────┐
              │                     │
        SYNC MANAGER           CONFLICT ENGINE
              │                     │
              └──────────┬──────────┘
                         │
                    INTERNET
                         │
                         ▼
                  QDRANT SERVER
                         │
                  CLOUD KNOWLEDGE
                         │
                  CLOUD AI SERVICES
                         │
                    CLOUD API
```

---

## 2. Storage Abstraction Layer

The platform does not couple components to a single database. Instead, it provides a polymorphic `IMemoryStore` interface:

```
MemoryStore (Abstract)
   ├── EdgeMemoryStore (Low-latency local vector math + on-device Qdrant Edge)
   └── CloudMemoryStore (Centralized Qdrant Cloud cluster for fleet analytics)
```

### The Edge-First Query Principle
1. **User / Sensor Query** triggers an on-device request.
2. **Local Memory** (`EdgeMemoryStore`) is scanned with 128-dimensional dense vector embeddings and cosine similarity (`O(N)` sub-millisecond on-device search).
3. **Local AI Engine** ("EdgeMind") reasons over the localized context and produces actionable answers.
4. **Cloud Search** is optional and only invoked when connectivity is available AND the policy permits cloud federation.
5. If connectivity is lost or unstable, **no errors are surfaced to operational tasks**; the system continues operating autonomously.

---

## 3. Memory Schema & Lifecycle

Every memory record (`MemoryItem`) encapsulates:
- **Identifier**: `M-xxxx`
- **Device Identity**: `DEV-001` through `DEV-005`
- **Tenant Scope**: `ORG-804` (AeroTech Industrial Dynamics)
- **Classification**: `Sensor observation`, `Event`, `Observation`, `Fact`, `Instruction`, `Preference`, `Document`, `Task`, `Knowledge`, `System event`
- **Embedding**: 128-dimensional dense vector
- **Privacy Sensitivity**: `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `SENSITIVE`, `LOCAL_ONLY`
- **Synchronization State**: `PENDING`, `QUEUED`, `SYNCING`, `SYNCED`, `FAILED`, `CONFLICT`, `DEFERRED`
- **Version Number**: Monotonically increasing version with diff tracking

### Memory Lifecycle Pipeline
```
CAPTURE ➔ PROCESS ➔ EMBED ➔ STORE LOCALLY ➔ CLASSIFY ➔ USE ➔ UPDATE ➔ EVALUATE ➔ SYNC OR RETAIN ➔ ARCHIVE / EXPIRE
```

---

## 4. Intelligent Routing & Conflict Resolution

### Routing Policies
- **Sensitive Diagnostic Data** (`LOCAL_ONLY`): Cryptographically retained on-device; never leaves edge hardware.
- **Critical Failures** (`HIGH_PRIORITY_SYNC`): Instant push to cloud queue upon network connection.
- **High-Frequency Telemetry** (`LOCAL_WITH_EXPIRATION`): 14-day sliding retention window to preserve edge flash storage.
- **Fleet Knowledge** (`SYNC_CLOUD`): Bidirectional sync with centralized engineering repositories.

### Conflict Detection & Resolution Strategies
When an edge device modifies a memory while disconnected, and the cloud or another fleet device also alters that memory:
1. **Version Mismatch**: Local `v3` differs from Cloud `v2`.
2. **Content Drift**: Sensor thermocouple divergence vs cloud smoothed models.
3. **Resolution Strategies**:
   - **Keep Local**: Edge on-site telemetry treated as authoritative ground truth.
   - **Keep Cloud**: Fleet engineering baseline overrides local drift.
   - **Synthesize & Merge**: Integrates both observations into a unified consensus memory.

---

## 5. Security & Hardware Isolation

- **TPM Hardware Vault**: Encrypted keys at rest on edge device.
- **Strict Tenant Separation**: Cross-organization vector namespaces prevented in Qdrant collections.
- **Full Audit Trail**: Every memory creation, search, delta sync, and conflict resolution is cryptographically recorded in `/api/audit-logs`.
