import ToolCard from "@/components/tool-card";

const categories = [
  {
    name: "Documents",
    tools: [
      { title: "PDF to Markdown", description: "Convert PDF documents to Markdown.", href: "/pdf-to-markdown", icon: "PDF", color: "#dc2626" },
      { title: "DOCX to Markdown", description: "Convert Word documents to Markdown.", href: "/docx-to-markdown", icon: "DOC", color: "#2563eb" },
      { title: "PPTX to Markdown", description: "Convert PowerPoint slides to Markdown.", href: "/pptx-to-markdown", icon: "PPT", color: "#ea580c" },
      { title: "XLSX to Markdown", description: "Convert Excel spreadsheets to Markdown.", href: "/xlsx-to-markdown", icon: "XLS", color: "#16a34a" },
      { title: "XLS to Markdown", description: "Convert legacy Excel files to Markdown.", href: "/xls-to-markdown", icon: "XLS", color: "#15803d" },
      { title: "MSG to Markdown", description: "Convert Outlook emails to Markdown.", href: "/msg-to-markdown", icon: "MSG", color: "#0284c7" },
    ],
  },
  {
    name: "Data",
    tools: [
      { title: "CSV to Markdown", description: "Convert CSV data to Markdown tables.", href: "/csv-to-markdown", icon: "CSV", color: "#7c3aed" },
      { title: "JSON to Markdown", description: "Convert JSON data to Markdown.", href: "/json-to-markdown", icon: "JSON", color: "#ca8a04" },
      { title: "XML to Markdown", description: "Convert XML data to Markdown.", href: "/xml-to-markdown", icon: "XML", color: "#0891b2" },
      { title: "Jupyter to Markdown", description: "Convert Jupyter notebooks to Markdown.", href: "/ipynb-to-markdown", icon: "NB", color: "#e85e0d" },
      { title: "ZIP to Markdown", description: "Extract and convert ZIP contents.", href: "/zip-to-markdown", icon: "ZIP", color: "#6b7280" },
    ],
  },
  {
    name: "Media",
    tools: [
      { title: "YouTube to Markdown", description: "Extract YouTube transcripts as Markdown.", href: "/youtube-to-markdown", icon: "YT", color: "#dc2626" },
      { title: "HTML to Markdown", description: "Convert web pages to Markdown.", href: "/html-to-markdown", icon: "HTML", color: "#e34f26" },
      { title: "EPUB to Markdown", description: "Convert eBooks to Markdown.", href: "/epub-to-markdown", icon: "EPUB", color: "#7c3aed" },
      { title: "Image to Markdown", description: "Extract image EXIF metadata.", href: "/image-to-markdown", icon: "IMG", color: "#0ea5e9" },
    ],
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
          PDF, Word, Excel, PowerPoint, YouTube and more — converted to clean Markdown files for free.
        </p>
      </section>

      {/* Category Grids */}
      {categories.map((cat) => (
        <section key={cat.name} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>
      ))}

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
            name: "ToMarkdown",
            description: "Free online tool to convert any file to Markdown",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
