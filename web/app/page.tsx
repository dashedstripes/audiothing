import Header from "@/components/header";
import { News, Tutorial } from "@/sanity.types";
import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/sanityImageUrl";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { defineQuery } from "next-sanity";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

interface NewsWithImage extends News {
  image: SanityAsset;
  lqip: PlaceholderValue;
}

interface TutorialWIthImage extends Tutorial {
  image: SanityAsset;
  lqip: PlaceholderValue;
}

export default async function Home() {
  const homePosts: (NewsWithImage | TutorialWIthImage)[] = await sanityFetch({
    query: defineQuery(
      `
      *[_type in ["news", "tutorial"]] | order(_createdAt desc) [0...12] {
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
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {homePosts.map((post) => {
            if (post._type == "news") {
              return (
                <Link
                  key={post._id}
                  href={`/news/${post?.slug?.current}`}
                  className="relative group rounded"
                >
                  <div className="relative">
                    <Image
                      width={400}
                      height={400}
                      src={urlFor(post.image)
                        .width(400)
                        .height(400)
                        .quality(20)
                        .url()}
                      alt={post.image.alt}
                      className="w-full rounded-lg"
                      placeholder={post.lqip}
                    />
                    <Image
                      width={400}
                      height={400}
                      src={post.lqip as string}
                      alt={post.image.alt}
                      className="w-full blur-3xl absolute top-0 left-0 -z-10 group-hover:blur-2xl transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-lg absolute bottom-0 h-full w-full left-0 flex flex-col justify-end group-hover:backdrop-blur backdrop-brightness-50 group-hover:backdrop-brightness-40 transition-all text-white">
                    <div>
                      <h6 className="uppercase text-xs">news</h6>
                      <h3 className="font-bold text-lg">{post.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            } else if (post._type == "tutorial") {
              return (
                <Link
                  key={post._id}
                  href={`/tutorials/${post?.slug?.current}`}
                  className="relative group rounded"
                >
                  <div className="relative">
                    <Image
                      width={400}
                      height={400}
                      src={urlFor(post.image)
                        .width(400)
                        .height(400)
                        .quality(20)
                        .url()}
                      alt={post.image.alt}
                      className="w-full rounded-lg"
                    />
                    <Image
                      width={400}
                      height={400}
                      src={post.lqip as string}
                      alt={post.image.alt}
                      className="w-full blur-3xl absolute top-0 left-0 -z-10 group-hover:blur-2xl transition-all"
                    />
                  </div>
                  <div className="p-4 rounded-lg absolute bottom-0 h-full w-full left-0 flex flex-col justify-end group-hover:backdrop-blur backdrop-brightness-50 group-hover:backdrop-brightness-40 transition-all text-white">
                    <div>
                      <h6 className="uppercase text-xs">tutorial</h6>
                      <h3 className="font-bold text-lg">{post.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            } else {
              return null;
            }
          })}
        </div>
        <div className="flex justify-center">
          <button className="bg-black px-3 py-1 text-white cursor-pointer rounded hover:shadow-2xl transition-all">
            Show More
          </button>
        </div>
      </div>
    </div>
  );
}
