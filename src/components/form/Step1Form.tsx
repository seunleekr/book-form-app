"use client";

export default function Step1Form() {
    return (
      <form>
        <input placeholder="도서 제목" />
        <input placeholder="독서 시작일" type="date" />
        <button type="submit">다음</button>
      </form>
    );
  }
  