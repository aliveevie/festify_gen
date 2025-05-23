import { cn } from "~~/lib/utils";
import { festivalDesigns } from "~~/components/templates/festivalDesigns";

interface DesignSelectorProps {
  selectedDesign: number;
  onSelectDesign: (designId: number) => void;
}

function renderPreviewSvg(svg: string) {
  // Replace placeholders with preview text
  return svg
    .replace(/\{\{festival\}\}/g, "Festival")
    .replace(/\{\{message\}\}/g, "Your Message")
    .replace(/\{\{date\}\}/g, "23/05/2025");
}

const DesignSelector = ({ selectedDesign, onSelectDesign }: DesignSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {festivalDesigns.map((design) => (
        <div
          key={design.id}
          className={cn(
            "bg-white rounded-xl p-4 flex flex-col items-center shadow-sm cursor-pointer border transition-all duration-200",
            selectedDesign === design.id
              ? "border-2 border-[#8854d0] shadow-lg"
              : "border border-gray-200 hover:shadow-md"
          )}
          onClick={() => onSelectDesign(design.id)}
        >
          <div className="w-32 h-32 rounded-md mb-3 overflow-hidden flex items-center justify-center bg-gray-50">
            <span
              dangerouslySetInnerHTML={{
                __html: renderPreviewSvg(design.svg.replace('width="500"', 'width="100"').replace('height="500"', 'height="100"')),
              }}
            />
          </div>
          <span className="text-sm font-medium text-center mt-1">{design.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DesignSelector; 