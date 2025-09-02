import Header from "@/components/header";
import PostsChunk from "@/components/posts-chunk";
import { News, Tutorial } from "@/sanity.types";
import { sanityFetch } from "@/sanity/client";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { defineQuery } from "next-sanity";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

export interface NewsWithImage extends News {
  image: SanityAsset;
  lqip: PlaceholderValue;
}

export interface TutorialWIthImage extends Tutorial {
  image: SanityAsset;
  lqip: PlaceholderValue;
}

export default async function Home() {
  const posts: (NewsWithImage | TutorialWIthImage)[] = await sanityFetch({
    query: defineQuery(
      `
      *[_type in ["news", "tutorial"]] | order(_createdAt desc) [0..11] {
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
