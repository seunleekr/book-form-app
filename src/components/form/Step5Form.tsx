"use client";

import { useState } from "react";

export default function Step5Form() {
    const [visibility, setVisibility] = useState("private");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("제출됨", visibility);
        alert('제출 완료! (${visibility === "public" ? "공개" : "비공개"})');
    };


    return (
        <form
        onSubmit={handleSubmit}
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
            type="radio"
            name="visibility"
            value="public"
            checked={visibility === "public"}
            onChange={(e) => setVisibility(e.target.value)}
            />
            공개
            </label>

        <label style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <input
             type="radio"
             name="visibility"
             value="private"
             checked={visibility === "private"}
             onChange={(e) => setVisibility(e.target.value)}
             />
             비공개
             </label>

        <button
         type="submit"
         style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "6px",
            background: "#f0f0f0",
            color: "white",
            cursor: "pointer",
            border: "none"
         }}
        >
            제출하기
        </button>
            
        </form>
    );
}