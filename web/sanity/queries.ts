import { groq } from "next-sanity";

export const HOME_POST_CHUNK = groq`
*[_type in ["news", "tutorial"] && ($lastCreatedAt == null || _createdAt < $lastCreatedAt)] | order(_createdAt desc)[0..11] {
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
`;
