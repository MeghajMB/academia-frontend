import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-white text-xl font-bold mb-4">Not Found</h2>
      <p className="text-white mb-4">Could not find requested resource</p>
      <Link className="text-blue-500 hover:underline" href="/">
        Return Home
      </Link>
    </div>
  );
}
