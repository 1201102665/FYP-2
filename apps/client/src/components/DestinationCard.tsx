import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Destination } from "@/services/destinationService";

interface DestinationCardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  destination?: Destination; // Optional destination object from API
  price?: number;
  rating?: number;
}

const DestinationCard = ({
  title,
  description,
  imageUrl,
  linkUrl = "#",
  destination,
  price,
  rating
}: DestinationCardProps) => {
  return (
    <div className="flex flex-col" data-id="3kocu6xe0" data-path="src/components/DestinationCard.tsx">
      <div className="overflow-hidden rounded-lg h-60 mb-4" data-id="idbdamf2c" data-path="src/components/DestinationCard.tsx">
        <img
          src={destination?.image || imageUrl}
          alt={destination?.name || title}
          className="w-full h-full object-cover" data-id="c64kkzleo" data-path="src/components/DestinationCard.tsx" />

      </div>
      <h3 className="text-lg font-bold" data-id="likbnvmdo" data-path="src/components/DestinationCard.tsx">{destination?.name || title}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-4" data-id="dpy5r6nc8" data-path="src/components/DestinationCard.tsx">{destination?.description || description}</p>
      {(destination?.price || price) &&
      <p className="text-aerotrav-blue font-semibold mb-2" data-id="s32br1k9v" data-path="src/components/DestinationCard.tsx">
          ${destination?.price || price} <span className="text-sm font-normal text-gray-500" data-id="7bmoo46rm" data-path="src/components/DestinationCard.tsx">per person</span>
        </p>
      }
      {(destination?.rating || rating) &&
      <div className="flex items-center mb-3" data-id="vzuy49odu" data-path="src/components/DestinationCard.tsx">
          <div className="flex" data-id="oumozjfy0" data-path="src/components/DestinationCard.tsx">
            {[...Array(5)].map((_, i) =>
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(destination?.rating || rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg" data-id="ospa9ksyz" data-path="src/components/DestinationCard.tsx">

                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-id="6nkgmd1f1" data-path="src/components/DestinationCard.tsx" />
              </svg>
          )}
          </div>
          <span className="text-sm text-gray-500 ml-1" data-id="txow5gdeg" data-path="src/components/DestinationCard.tsx">{destination?.rating || rating}</span>
        </div>
      }
      <div className="mt-auto" data-id="qpgqnlqz1" data-path="src/components/DestinationCard.tsx">
        <Link to={destination ? `/destinations/${destination.id}` : linkUrl} className="text-aerotrav-blue hover:text-aerotrav-blue-700 inline-flex items-center text-sm font-medium" data-id="tap383ydk" data-path="src/components/DestinationCard.tsx">
          Explore
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="jukha4b32" data-path="src/components/DestinationCard.tsx">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" data-id="3t1cyt8nx" data-path="src/components/DestinationCard.tsx" />
          </svg>
        </Link>
      </div>
    </div>);

};

export default DestinationCard;