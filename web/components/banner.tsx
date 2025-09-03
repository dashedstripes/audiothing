import { BANNERSResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/live";
import { BANNERS } from "@/sanity/queries";
import { defineQuery } from "next-sanity";

export default async function Banner() {
  const { data }: { data: BANNERSResult } = await sanityFetch({
    query: defineQuery(BANNERS),
  });

  if (!data) return null;

  return (
    <>
      {data.map((banner) => (
        <div
          key={banner._id}
          className="bg-sky-900 px- py-2 text-center text-white"
        >
          <span className="block text-sm text-gray-200 font-bold">
            {banner.title}
          </span>
          <span className="block text-sm text-gray-300">
            {banner?.subtitle}
          </span>
        </div>
      ))}
    </>
  );
}
