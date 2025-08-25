import Image from "next/image";
import Link from "next/link";
const posts = [
  {
    id: "one",
    image: "https://picsum.photos/600/400",
    title: "Mastering AI-Powered Mixing: A Beginner's Tutorial for 2025 Tools",
    category: "tutorial",
  },
  {
    id: "two",
    image: "https://picsum.photos/600/400?random=1",
    title: "Top 5 Spatial Audio Plugins Reviewed: Immersive Sound on a Budget",
    category: "review",
  },
  {
    id: "three",
    image: "https://picsum.photos/600/400?random=2",
    title: "Major DAW Updates Announced at NAMM 2025",
    category: "news",
  },
  {
    id: "four",
    image: "https://picsum.photos/600/400?random=3",
    title: "Step-by-Step Guide to Cloud Collaboration in Music Production",
    category: "tutorial",
  },
  {
    id: "five",
    image: "https://picsum.photos/600/400?random=4",
    title: "Sustainable Audio Gear - Eco-Friendly Microphones Tested",
    category: "review",
  },
  {
    id: "six",
    image: "https://picsum.photos/600/400?random=5",
    title: "Creating 'Dirty' Aesthetics with Vintage Effects Plugins",
    category: "tutorial",
  },
  {
    id: "seven",
    image: "https://picsum.photos/600/400?random=6",
    title: "Step-by-Step Guide to Cloud Collaboration in Music Production",
    category: "tutorial",
  },
  {
    id: "eight",
    image: "https://picsum.photos/600/400?random=7",
    title: "Sustainable Audio Gear - Eco-Friendly Microphones Tested",
    category: "review",
  },
  {
    id: "nine",
    image: "https://picsum.photos/600/400?random=8",
    title: "Creating 'Dirty' Aesthetics with Vintage Effects Plugins",
    category: "tutorial",
  },
];
export default function Home() {
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
          {posts.map((post) => (
            <Link
              href={`/posts/${post.id}`}
              key={post.id}
              className="relative group rounded"
            >
              <div className="relative">
                <Image
                  width={800}
                  height={400}
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded"
                />
                <Image
                  width={800}
                  height={400}
                  src={post.image}
                  alt={post.title}
                  className="w-full blur-3xl absolute top-0 left-0 -z-10 group-hover:blur-2xl transition-all"
                />
              </div>
              <div className="p-4 rounded absolute bottom-0 h-full w-full left-0 flex flex-col justify-end group-hover:backdrop-blur backdrop-brightness-50 group-hover:backdrop-brightness-40 transition-all text-white">
                <div>
                  <h6 className="uppercase text-xs">{post.category}</h6>
                  <h3 className="font-bold text-lg">{post.title}</h3>
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
