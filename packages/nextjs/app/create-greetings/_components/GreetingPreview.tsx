import { festivalDesigns } from "~~/components/templates/festivalDesigns";

interface GreetingPreviewProps {
  message: string;
  festivalType: string;
  design: number;
  sender?: string;
  date?: string;
}

function renderGreetingSvg(svg: string, festival: string, message: string, date: string) {
  return svg
    .replace(/\{\{festival\}\}/g, festival)
    .replace(/\{\{message\}\}/g, message)
    .replace(/\{\{date\}\}/g, date);
}

const GreetingPreview = ({ message, festivalType, design, sender = "Your Name", date = "" }: GreetingPreviewProps) => {
  const designObj = festivalDesigns.find(d => d.id === design);
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4">Preview</h3>
      <div className="w-full max-w-sm rounded-2xl shadow-lg p-0 flex flex-col items-center justify-center text-center min-h-[300px] transition-colors duration-300 bg-white overflow-hidden">
        {designObj ? (
          <div
            className="w-full flex justify-center"
            dangerouslySetInnerHTML={{
              __html: renderGreetingSvg(
                designObj.svg.replace('width="500"', 'width="320"').replace('height="500"', 'height="240"'),
                festivalType,
                message,
                date
              ),
            }}
          />
        ) : (
          <div className="p-10">Design not found</div>
        )}
        <div className="pt-4 pb-2 text-sm opacity-80">From: {sender}</div>
      </div>
    </div>
  );
};

export default GreetingPreview; 