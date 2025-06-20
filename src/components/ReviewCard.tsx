interface ReviewCardProps {
  text: string;
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
}

const ReviewCard = ({ text, author }: ReviewCardProps) => {
  return (
    <div className="border border-yellow-400 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow" data-id="ycro3hc1g" data-path="src/components/ReviewCard.tsx">
      <div className="flex items-center text-yellow-400 mb-3" data-id="rdfkvcskf" data-path="src/components/ReviewCard.tsx">
        {[...Array(5)].map((_, i) =>
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg" data-id="cfkyqaawq" data-path="src/components/ReviewCard.tsx">

            <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="none" data-id="34yh0u0j3" data-path="src/components/ReviewCard.tsx" />

          </svg>
        )}
      </div>
      <p className="text-sm mb-4" data-id="0wztvxik6" data-path="src/components/ReviewCard.tsx">"{text}"</p>
      <div className="flex items-center mt-4" data-id="svvo70rf1" data-path="src/components/ReviewCard.tsx">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-yellow-400" data-id="r1a1h87co" data-path="src/components/ReviewCard.tsx">
          <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" data-id="3yza0eiei" data-path="src/components/ReviewCard.tsx" />
        </div>
        <div data-id="oyp1c1nxq" data-path="src/components/ReviewCard.tsx">
          <p className="text-sm font-semibold" data-id="3jgk94051" data-path="src/components/ReviewCard.tsx">{author.name}</p>
          <p className="text-xs text-gray-500" data-id="ng5lxr1lh" data-path="src/components/ReviewCard.tsx">{author.title}</p>
        </div>
      </div>
    </div>);

};

export default ReviewCard;