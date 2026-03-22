import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AllToMD. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">About</Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
