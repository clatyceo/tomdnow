import Link from "next/link";

const tools = [
  { name: "PDF to Markdown", href: "/pdf-to-markdown" },
  { name: "DOCX to Markdown", href: "/docx-to-markdown" },
  { name: "YouTube to Markdown", href: "/youtube-to-markdown" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-15 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          AllToMD
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
