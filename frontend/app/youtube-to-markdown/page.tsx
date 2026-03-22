import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ConverterPage from "@/components/converter-page";

const tool = tools.youtube;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function YoutubeToMarkdown() {
  return (
    <>
      <ConverterPage tool={tool} />
      <SeoContent />
    </>
  );
}

function SeoContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900">How to Convert YouTube to Markdown</h2>
        <ol className="mt-4 space-y-3">
          {tool.howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{step.step}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Why Convert YouTube to Markdown?</h2>
        <ul className="mt-4 space-y-2">
          {tool.whyConvert.map((reason, i) => (
            <li key={i} className="flex gap-2 text-gray-600">
              <span className="text-blue-500">-</span> {reason}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
        <div className="mt-4 space-y-4">
          {tool.faq.map((item, i) => (
            <div key={i}>
              <h3 className="font-medium text-gray-900">{item.q}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: tool.h1,
              step: tool.howTo.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.step,
                text: s.desc,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: tool.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />
    </div>
  );
}
