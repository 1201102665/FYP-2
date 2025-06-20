import { Button } from "@/components/ui/button";

interface AdventureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
}

const AdventureCard = ({
  title,
  description,
  imageUrl,
  buttonText = "Read More",
  buttonLink = "#"
}: AdventureCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden flex relative shadow-lg hover:shadow-xl transition-all" data-id="24zivdtnk" data-path="src/components/AdventureCard.tsx">
      <div className="w-1/3 overflow-hidden" data-id="yi7s96xlp" data-path="src/components/AdventureCard.tsx">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" data-id="9uswdejp8" data-path="src/components/AdventureCard.tsx" />
      </div>
      <div className="p-6 flex flex-col justify-between w-2/3" data-id="jjh7qlpmw" data-path="src/components/AdventureCard.tsx">
        <div data-id="8mpu68zez" data-path="src/components/AdventureCard.tsx">
          <h3 className="text-xl font-bold text-white mb-2" data-id="26r99jycf" data-path="src/components/AdventureCard.tsx">{title}</h3>
          <p className="text-sm text-white mt-1" data-id="olcjv03ko" data-path="src/components/AdventureCard.tsx">{description}</p>
        </div>
        <div className="mt-4" data-id="3er46cy56" data-path="src/components/AdventureCard.tsx">
          <Button className="bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-gray-900 rounded-full px-6 py-1 h-auto" data-id="5trcxq7a3" data-path="src/components/AdventureCard.tsx">
            {buttonText}
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-aerotrav-blue to-aerotrav-blue-700 opacity-90 -z-10" data-id="mcgo1km8a" data-path="src/components/AdventureCard.tsx"></div>
    </div>);

};

export default AdventureCard;