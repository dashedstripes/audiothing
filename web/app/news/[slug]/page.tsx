import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/sanityImageUrl";
import { defineQuery } from "next-sanity";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

export default async function NewsPage(props) {
  const { slug } = await props.params;
  const news = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "news" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        body,
        "image": mainImage,
        "imageUrl": mainImage.asset->url
      }
      `,
    ),
    params: {
      slug,
    },
    revalidate: 1,
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
      <div className="relative">
        <div
          style={{
            backgroundImage: `url(${urlFor(news.image).width(500).height(200).quality(1).url()})`,
            backgroundSize: "cover",
            filter: "brightness(50%)",
          }}
          className="h-[400px] relative"
        ></div>
        <div className="absolute top-0 left-0 w-full">
          <div className="container mx-auto w-[65ch] px-8 text-white">
            <div className="py-40 text-center">
              <h4 className="uppercase text-gray-200">News</h4>
              <h1 className="text-3xl font-bold">{news.title}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 w-[65ch]">
        <div className="article">
          <PortableText value={news.body} />
        </div>
      </div>
    </div>
  );
}
