import { client } from "@/sanity/client";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { token } from "@/sanity/token";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
