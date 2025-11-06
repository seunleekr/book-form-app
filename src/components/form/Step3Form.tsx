"use client";

import { useState } from "react";

export default function Step3Form() {
    const [review, setReview] = useState("");

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

        <label>
            독후감
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="독후감을 입력해주세요."
              rows={8}
              style={{
                width: "100%",
                padding: "10px",
                resize: "vertical",
                fontSize: "15px",
                lineHeight: "1.5",
              }}
            />
        </label>

        <div style={{ fontSize: "12px", color: "#666", textAlign: "right" }}>
            {review.length} / 500자
        </div>

        <button type="submit">다음</button>
      </form>
    );
}
