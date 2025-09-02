import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/sanityImageUrl";
import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Tutorial } from "@/sanity.types";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Header from "@/components/header";

interface TutorialWIthImage extends Tutorial {
  image: SanityAsset;
  lqip: PlaceholderValue;
}

export async function generateStaticParams() {
  const news = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "tutorial"] | order(_createdAt desc)[0..11] {
        slug,
      }
      `,
    ),
  });

  return news.map((item: { slug: { current: string } }) => ({
    slug: item.slug.current,
  }));
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutorial: TutorialWIthImage = await sanityFetch({
    query: defineQuery(
      `
      *[_type == "tutorial" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        steps,
        "image": mainImage,
        "lqip": mainImage.asset->.metadata.lqip
      }
      `,
    ),
    params: {
      slug,
    },
  });

  return (
    <div>
      <Header />
      <div className="relative">
        <div className="w-full h-[400px] relative overflow-hidden">
          <Image
            src={`${urlFor(tutorial.image).width(1000).height(200).quality(50).url()}`}
            width={500}
            height={500}
            alt={tutorial.title as string}
            placeholder={tutorial.lqip}
            className="w-full h-full top-0 left-0 absolute object-cover object-center"
          />
        </div>
        <div className="absolute top-0 left-0 w-full">
          <div className="container mx-auto md:w-[65ch] px-8 text-white">
            <div className="py-40 text-center">
              <h4 className="uppercase text-gray-200">Tutorial</h4>
              <h1 className="text-3xl font-bold">{tutorial.title}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 md:w-[65ch]">
        <div className="article">
          {tutorial?.steps?.map((step, index) => (
            <div key={step._key}>
              <h3>Step {index + 1}</h3>
              {step.details && <PortableText value={step.details} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
