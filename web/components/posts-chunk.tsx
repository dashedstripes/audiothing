"use client";

import { NewsWithImage, TutorialWIthImage } from "@/app/page";
import NewsCard from "./news-card";
import TutorialCard from "./tutorial-card";
import { useState } from "react";
import { sanityFetch } from "@/sanity/client";
import { defineQuery } from "next-sanity";
import PlaceholderCard from "./placeholder-card";

export default function PostsChunk({
  initialPosts,
}: {
  initialPosts: (NewsWithImage | TutorialWIthImage)[];
}) {
  const [posts, setPosts] =
    useState<(NewsWithImage | TutorialWIthImage)[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  async function fetchMorePosts(lastCreatedAt: string) {
    const data = await sanityFetch({
      query: defineQuery(
        `
        *[_type in ["news", "tutorial"] && _createdAt < $lastCreatedAt] | order(_createdAt desc)[0..11] {
          _id,
          _type,
          title,
          slug,
          _createdAt,
          _type == "news" => {
            "image": mainImage,
            "lqip": mainImage.asset->.metadata.lqip
          },
          _type == "tutorial" => {
            "image": mainImage,
            "lqip": mainImage.asset->.metadata.lqip
          }
        }
        `,
      ),
      params: {
        lastCreatedAt,
      },
    });

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
                image={post.image}
                imageAlt={post.image.alt}
                lqip={post.lqip}
              />
            );
          } else if (post._type == "tutorial") {
            return (
              <TutorialCard
                key={post._id}
                slug={post.slug?.current as string}
                title={post.title as string}
                image={post.image}
                imageAlt={post.image.alt}
                lqip={post.lqip}
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
    </div>
  );
}
