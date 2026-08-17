import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  size?: number;
}

export default function StarRating({ score, size = 20 }: StarRatingProps) {
  const normalizedScore = (score / 1000) * 5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFull = starValue <= normalizedScore;
        const isPartial = !isFull && starValue - 1 < normalizedScore;
        const fillPercentage = isPartial
          ? Math.round((normalizedScore - Math.floor(normalizedScore)) * 100)
          : 100;

        return (
          <div key={index} className="relative">
            <Star
              size={size}
              className="text-gray-300 fill-gray-300"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            {(isFull || isPartial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFull ? "100%" : `${fillPercentage}%` }}
              >
                <Star
                  size={size}
                  className="text-indigo-700 fill-indigo-700"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
