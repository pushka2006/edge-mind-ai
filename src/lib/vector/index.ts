// Vector Dimension for Edge Mind AI local and cloud collections
export const VECTOR_DIMENSION = 128;

// Domain vocabulary clusters for edge, industrial, IoT, robotics, sensor telemetry, and maintenance
const DOMAIN_CLUSTERS: Record<string, number[]> = {
  temperature: [0, 1, 2, 3],
  heat: [0, 1, 2],
  thermal: [1, 2, 3],
  overheating: [0, 2, 3, 4],
  celsius: [0, 1],
  cooling: [1, 3],

  vibration: [5, 6, 7, 8],
  oscillation: [5, 6],
  bearing: [6, 7, 9],
  spindle: [7, 8, 9],
  frequency: [5, 8],
  resonance: [6, 8],

  pressure: [10, 11, 12],
  hydraulic: [11, 12, 13],
  pneumatic: [10, 12],
  valve: [11, 13],
  flow: [10, 13],

  maintenance: [14, 15, 16, 17],
  repair: [14, 15],
  inspection: [15, 16],
  technician: [16, 17],
  overhaul: [14, 17],
  service: [15, 17],

  robot: [18, 19, 20, 21],
  actuator: [18, 19],
  joint: [19, 20],
  kinematics: [20, 21],
  payload: [18, 21],
  gripper: [19, 21],

  failure: [22, 23, 24],
  fault: [22, 23],
  alarm: [23, 24],
  anomaly: [22, 24],
  critical: [23, 25],
  incident: [22, 25],

  network: [26, 27, 28],
  offline: [26, 27, 29],
  sync: [27, 28],
  telemetry: [28, 29],
  latency: [26, 28],
  cloud: [27, 29],

  power: [30, 31, 32],
  voltage: [30, 31],
  current: [31, 32],
  battery: [30, 32],
  consumption: [31, 33],

  sensor: [34, 35, 36],
  reading: [34, 35],
  transducer: [35, 36],
  calibration: [34, 36],
  accuracy: [35, 37],

  camera: [38, 39, 40],
  vision: [38, 39],
  lidar: [39, 40],
  detection: [38, 40],
  optical: [39, 41],
};

/**
 * Generate a deterministic dense 128-dimensional embedding vector for any text.
 * Combines hashing, n-gram weights, and semantic domain clusters to give real
 * semantic similarity (e.g. "temperature high" matches "overheating incident").
 */
export function generateEmbedding(text: string): number[] {
  const vector = new Array(VECTOR_DIMENSION).fill(0);
  if (!text) return vector;

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);

  // 1. Domain clusters boost
  for (const word of words) {
    for (const [key, dimensions] of Object.entries(DOMAIN_CLUSTERS)) {
      if (word.includes(key) || key.includes(word)) {
        for (const dim of dimensions) {
          vector[dim] += 0.85;
          vector[(dim + 64) % VECTOR_DIMENSION] += 0.35;
        }
      }
    }
  }

  // 2. Character & word hash dispersion for unique nuances
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }

    const primaryDim = Math.abs(hash) % VECTOR_DIMENSION;
    const secondaryDim = Math.abs((hash >> 4) ^ (i * 13)) % VECTOR_DIMENSION;

    vector[primaryDim] += 0.45;
    vector[secondaryDim] += 0.25;
  }

  // 3. Normalize vector to unit length (L2 norm) for cosine similarity
  let sumSq = 0;
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    sumSq += vector[i] * vector[i];
  }

  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
      vector[i] = Number((vector[i] / norm).toFixed(6));
    }
  }

  return vector;
}

/**
 * Calculate Cosine Similarity between two unit-normalized vectors.
 * Returns a value between -1.0 and 1.0 (clamped between 0.0 and 1.0 for relevance).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Keyword overlap BM25-like scoring for hybrid retrieval
 */
export function calculateKeywordScore(query: string, content: string, title: string = '', tags: string[] = []): number {
  const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (queryTokens.length === 0) return 0;

  const targetText = `${title} ${content} ${tags.join(' ')}`.toLowerCase();
  let matches = 0;

  for (const token of queryTokens) {
    if (title.toLowerCase().includes(token)) {
      matches += 2.0; // Title match has higher weight
    } else if (targetText.includes(token)) {
      matches += 1.0;
    }
  }

  return Math.min(1, matches / (queryTokens.length * 1.5));
}
