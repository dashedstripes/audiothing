import Header from "@/components/header";
import PostsChunk from "@/components/posts-chunk";
import { Locale } from "@/i18n-config";
import { HOME_POST_CHUNKResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/client";
import { HOME_POST_CHUNK } from "@/sanity/queries";
import { defineQuery } from "next-sanity";

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const posts: HOME_POST_CHUNKResult = await sanityFetch({
    query: defineQuery(HOME_POST_CHUNK),
    params: {
      lastCreatedAt: null,
      language: lang,
    },
  });

  return (
    <div>
      <Header />
      <div className="container mx-auto px-8">
        <div className="py-40 text-center">
          <h1>
            <span className="font-bold">audio</span>thing
          </h1>
          <p>audio production tips, techniques, reviews and news</p>
        </div>
        <PostsChunk initialPosts={posts} />
      </div>
    </div>
  );
}
