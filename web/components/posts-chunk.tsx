"use client";

import NewsCard from "./news-card";
import TutorialCard from "./tutorial-card";
import { useState } from "react";
import { sanityFetch } from "@/sanity/client";
import { defineQuery } from "next-sanity";
import PlaceholderCard from "./placeholder-card";
import { HOME_POST_CHUNK } from "@/sanity/queries";
import { HOME_POST_CHUNKResult } from "@/sanity.types";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

const CHUNK_SIZE = 12;

export default function PostsChunk({
  initialPosts,
}: {
  initialPosts: HOME_POST_CHUNKResult;
}) {
  const [posts, setPosts] = useState<HOME_POST_CHUNKResult>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);

  async function fetchMorePosts(lastCreatedAt: string) {
    const data: HOME_POST_CHUNKResult = await sanityFetch({
      query: defineQuery(HOME_POST_CHUNK),
      params: {
        lastCreatedAt,
      },
    });

    if (data.length < CHUNK_SIZE) {
      setShowButton(false);
    }

    setPosts((posts) => [...posts, ...data]);
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-20">
        {posts.map((post) => {
          if (post._type == "news") {
            return (
              <NewsCard
                key={post._id}
                slug={post.slug?.current as string}
                title={post.title as string}
                image={post.image as SanityAsset}
                imageAlt={post.image?.alt as string}
                lqip={post.lqip as PlaceholderValue}
              />
            );
          } else if (post._type == "tutorial") {
            return (
              <TutorialCard
                key={post._id}
                slug={post.slug?.current as string}
                title={post.title as string}
                image={post.image as SanityAsset}
                imageAlt={post.image?.alt as string}
                lqip={post.lqip as PlaceholderValue}
              />
            );
          } else {
            return null;
          }
        })}
        {loading && (
          <>
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
          </>
        )}
      </div>
      {showButton && (
        <div className="flex justify-center">
          <button
            onClick={async () => {
              setLoading(true);
              await fetchMorePosts(posts[posts.length - 1]._createdAt);
              setLoading(false);
            }}
            className="bg-black px-3 py-1 text-white cursor-pointer rounded hover:shadow-2xl transition-all"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
