"use client";

import { useState } from "react";

export default function Step2Form() {
    const [recommended, setRecommended] = useState(false);
    const [rating, setRating] = useState(0);
    return (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "400px",
            marginTop: "20px",
          }}
        >

        <label style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <input
         type="checkbox"
         checked={recommended}
         onChange={(e) => setRecommended(e.target.checked)}
        />
        이 도서를 추천 하시겠습니까?
        </label>

        <label>
            별점: {rating} /5
            <input
             type="range"
             min="0"
             max="5"
             step="0.5"
             value={rating}
             onChange={(e) => setRating(Number(e.target.value))}
            />
        </label>
        
        <button type="submit">다음</button>
        </form>
    );
}