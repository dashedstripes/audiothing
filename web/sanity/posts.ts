import { HOME_POST_CHUNK } from "@/sanity/queries";
import { sanityFetch, type DynamicFetchOptions } from "@/sanity/live";
import type { HOME_POST_CHUNKResult } from "@/sanity.types";

export async function fetchPostsChunk({
  lastCreatedAt,
  language,
  perspective,
  stega,
}: {
  lastCreatedAt: string | null;
  language: string;
} & DynamicFetchOptions): Promise<HOME_POST_CHUNKResult> {
  "use cache";
  const { data } = await sanityFetch({
    query: HOME_POST_CHUNK,
    params: { lastCreatedAt, language },
    perspective,
    stega,
  });
  return data;
}
