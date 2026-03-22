import ToolCard from "@/components/tool-card";

const tools = [
  {
    title: "PDF to Markdown",
    description: "Convert PDF documents to clean, readable Markdown files.",
    href: "/pdf-to-markdown",
    icon: "PDF",
    color: "#dc2626",
  },
  {
    title: "DOCX to Markdown",
    description: "Convert Word documents to Markdown format instantly.",
    href: "/docx-to-markdown",
    icon: "DOC",
    color: "#2563eb",
  },
  {
    title: "YouTube to Markdown",
    description: "Extract YouTube video transcripts as Markdown files.",
    href: "/youtube-to-markdown",
    icon: "YT",
    color: "#dc2626",
  },
];

const features = [
  { title: "100% Free", desc: "No sign-up, no limits, no hidden fees." },
  { title: "Fast Conversion", desc: "Convert files in seconds, not minutes." },
  { title: "Instant Download", desc: "Download or copy your Markdown right away." },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Convert Any File to{" "}
          <span className="font-serif italic text-blue-600">Markdown</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          PDF, Word, YouTube videos and more — converted to clean Markdown files for free.
        </p>
      </section>

      {/* Tool Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AllToMD",
            description: "Free online tool to convert files to Markdown",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
