import Link from "next/link";

export default function Header() {
  return (
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
  );
}
