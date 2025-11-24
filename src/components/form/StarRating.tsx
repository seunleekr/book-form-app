interface StarRatingProps {
    rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {Array.from({ length: fullStars }).map((_, i) => (
                <span key={`full-${i}`} style={{ color: "#fbbf24", fontSize: "16px" }}>★</span>
            ))}
            {hasHalfStar && (
                <span style={{ color: "#fbbf24", fontSize: "16px" }}>☆</span>
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <span key={`empty-${i}`} style={{ color: "#d1d5db", fontSize: "16px" }}>★</span>
            ))}
            <span style={{ marginLeft: "4px", fontSize: "14px", color: "#6b7280" }}>
                {rating > 0 ? rating.toFixed(1) : "0.0"}
            </span>
        </div>
    );
}

