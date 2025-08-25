import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/sanityImageUrl";
import { defineQuery } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const allNews = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "news"] {
        _id,
        title,
        slug,
        "image": mainImage,
        "imageUrl": mainImage.asset->url
      }
      `,
    ),
  });

  return (
    <div>
      <nav className="container mx-auto p-8 flex justify-between items-center">
        <Link href="/">
          <span className="font-bold">audio</span>thing
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/">tutorials</Link>
          </li>
          <li>
            <Link href="/">reviews</Link>
          </li>
          <li>
            <Link href="/">news</Link>
          </li>
        </ul>
      </nav>
      <div className="container mx-auto px-8">
        <div className="py-40 text-center">
          <h1>
            <span className="font-bold">audio</span>thing
          </h1>
          <p>audio production tips, techniques, reviews and news</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-20">
          {allNews.map((news) => (
            <Link
              key={news._id}
              href={`/news/${news?.slug?.current}`}
              className="relative group rounded"
            >
              <div className="relative">
                <Image
                  width={400}
                  height={400}
                  src={urlFor(news.image)
                    .width(400)
                    .height(400)
                    .quality(20)
                    .url()}
                  alt={news.image.alt}
                  className="w-full rounded-lg"
                />
                <Image
                  width={400}
                  height={400}
                  src={urlFor(news.image).width(10).height(10).quality(1).url()}
                  alt={news.image.alt}
                  className="w-full blur-3xl absolute top-0 left-0 -z-10 group-hover:blur-2xl transition-all"
                />
              </div>
              <div className="p-4 rounded-lg absolute bottom-0 h-full w-full left-0 flex flex-col justify-end group-hover:backdrop-blur backdrop-brightness-50 group-hover:backdrop-brightness-40 transition-all text-white">
                <div>
                  <h6 className="uppercase text-xs">news</h6>
                  <h3 className="font-bold text-lg">{news.title}</h3>
                </div>
              </div>
            </Link>
          ))}
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
