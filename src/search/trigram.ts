/**
 * Naive trigram index + search for prototyping.
 * For serious use, replace with Postgres pg_trgm, Elastic, Meilisearch, etc.
 */

export type TrigramIndex = Map<string, Set<string>>; // trigram -> set of eventIds

function toTrigrams(text: string): string[] {
  const normalized = `  ${text.toLowerCase()}  `;
  const trigrams: string[] = [];
  for (let i = 0; i < normalized.length - 2; i++) {
    trigrams.push(normalized.slice(i, i + 3));
  }
  return trigrams;
}

export function buildTrigramIndex(
  documents: { id: string; text: string }[]
): TrigramIndex {
  const index: TrigramIndex = new Map();

  for (const doc of documents) {
    const seen = new Set<string>();
    for (const tri of toTrigrams(doc.text)) {
      if (seen.has(tri)) continue;
      seen.add(tri);
      if (!index.has(tri)) {
        index.set(tri, new Set());
      }
      index.get(tri)!.add(doc.id);
    }
  }

  return index;
}

export function searchTrigramIndex(
  index: TrigramIndex,
  query: string
): Set<string> {
  const trigrams = toTrigrams(query);
  const counts: Map<string, number> = new Map();

  for (const tri of trigrams) {
    const ids = index.get(tri);
    if (!ids) continue;
    for (const id of ids) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const results = new Set<string>();
  for (const [id, count] of counts.entries()) {
    if (count > 0) results.add(id);
  }

  return results;
}
