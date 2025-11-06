"use client";

import { useState } from "react";

export default function Step4Form() {
    const [quotes, setQuotes] = useState([{ text: "", page: ""}]);

    const addQuote = () => {
        setQuotes([...quotes, { text: "", page: ""}]);
    };

    const removeQuote = (index: number) => {
        setQuotes(quotes.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: "text" | "page", value: string) => {
        const newQuotes = [...quotes];
        newQuotes[index][field] = value;
        setQuotes(newQuotes);
    };
    
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

        {quotes.map((quote, index) => (
            <div
             key={index}
             style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
             }}
            >
            <label>
                인용구
                <textarea
                 value={quote.text}
                 onChange={(e) => handleChange(index, "text", e.target.value)}
                 placeholder="인용구를 입력해주세요."
                 rows={3}
                 style={{ width: "100%", resize: "vertical" }}
                 />
            </label>  

            <label>
                페이지 번호
                <input
                 type="number"
                 value={quote.page}
                 onChange={(e) => handleChange(index, "page", e.target.value)}
                 placeholder="페이지를 입력해주세요."
                 />
            </label>

            {quotes.length > 1 && (
                <button
                 type="button"
                 onClick={() => removeQuote(index)}
                 style={{
                    alignSelf: "flex-end",
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                 }}
                >
                 x 삭제
                </button>
            )}
            </div>
        ))}


        <button
         type="button"
         onClick={addQuote}
         style={{
            background: "#f0f0f0",
            border: "1px dashed #aaa",
            padding: "8px",
            cursor: "pointer",
         }}
        >
            + 인용구 추가
        </button>

        <button type="submit">다음</button>
        </form>
    );
}