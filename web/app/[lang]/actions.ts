"use server";

import { getDynamicFetchOptions } from "@/sanity/live";
import { fetchPostsChunk } from "@/sanity/posts";
import type { HOME_POST_CHUNKResult } from "@/sanity.types";

export async function loadMorePosts({
  lastCreatedAt,
  language,
}: {
  lastCreatedAt: string;
  language: string;
}): Promise<HOME_POST_CHUNKResult> {
  // Server actions can't accept perspective/stega as props (inputs are
  // untrusted), so resolve them here and forward to the cached helper.
  const { perspective, stega } = await getDynamicFetchOptions();
  return fetchPostsChunk({ lastCreatedAt, language, perspective, stega });
}
