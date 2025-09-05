import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/sanityImageUrl";
import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Header from "@/components/header";
import { i18n } from "@/i18n-config";

export async function generateStaticParams() {
  const news = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "news" && (language in $locales)] | order(_createdAt desc)[0..11] {
        slug,
        language,
      }
      `,
    ),
    params: {
      locales: i18n.locales,
    },
  });

  return news.map((item: { slug: { current: string }; language: string }) => ({
    slug: item.slug.current,
    lang: item.language,
  }));
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;

  const news = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "news" && slug.current == $slug && language == $language][0] {
        _id,
        title,
        slug,
        body,
        "image": mainImage,
        "lqip": mainImage.asset->.metadata.lqip
      }
      `,
    ),
    params: {
      slug,
      language: lang,
    },
  });

  return (
    <div>
      <Header />
      <div className="relative">
        <div className="w-full h-[400px] relative overflow-hidden">
          <Image
            src={`${urlFor(news.image).width(1000).height(200).quality(50).url()}`}
            width={500}
            height={500}
            alt={news.title}
            placeholder={news.lqip}
            className="w-full h-full top-0 left-0 absolute object-cover object-center"
          />
        </div>
        <div className="absolute top-0 left-0 w-full">
          <div className="container mx-auto md:w-[65ch] px-8 text-white">
            <div className="py-40 text-center">
              <h4 className="uppercase text-gray-200">News</h4>
              <h1 className="text-3xl font-bold">{news.title}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 md:w-[65ch]">
        <div className="article">
          <PortableText value={news.body} />
        </div>
      </div>
    </div>
  );
}
