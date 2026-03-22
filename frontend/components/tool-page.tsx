import { ToolConfig } from "@/lib/tools";
import ConverterPage from "./converter-page";
import SeoContent from "./seo-content";

export default function ToolPage({ tool }: { tool: ToolConfig }) {
  return (
    <>
      <ConverterPage tool={tool} />
      <SeoContent tool={tool} />
    </>
  );
}
