import { urlFor } from "@/sanity/sanityImageUrl";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import Link from "next/link";
import Image from "next/image";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

export default function NewsCard({
  slug,
  title,
  image,
  imageAlt,
  lqip,
}: {
  slug: string;
  title: string;
  image: SanityAsset;
  imageAlt: string;
  lqip: PlaceholderValue;
}) {
  return (
    <Link href={`/news/${slug}`} className="relative group rounded">
      <div className="relative">
        <Image
          width={400}
          height={400}
          src={urlFor(image).width(400).height(400).quality(20).url()}
          alt={imageAlt}
          className="w-full rounded-lg"
          placeholder={lqip}
        />
        <Image
          width={400}
          height={400}
          src={lqip as string}
          alt={imageAlt}
          className="w-full blur-3xl absolute top-0 left-0 -z-10 group-hover:blur-2xl transition-all"
        />
      </div>
      <div className="p-4 rounded-lg absolute bottom-0 h-full w-full left-0 flex flex-col justify-end group-hover:backdrop-blur backdrop-brightness-50 group-hover:backdrop-brightness-40 transition-all text-white">
        <div>
          <h6 className="uppercase text-xs">news</h6>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
