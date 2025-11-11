"use client";

import { useState, useEffect } from "react";
import { useFormContextData } from "@/context/FormContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useWindowWidth } from "@/hooks/useWindowW";
import { FormValues } from "@/context/FormContext";
import StarRating from "./StarRating";

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        to_read: "읽고 싶은 책",
        reading: "읽는 중",
        finished: "읽음",
        on_hold: "보류 중",
    };
    return labels[status] || "";
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        to_read: "#3b82f6",
        reading: "#10b981",
        finished: "#8b5cf6",
        on_hold: "#f59e0b",
    };
    return colors[status] || "#6b7280";
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function PreviewPane() {
    const [isMounted, setIsMounted] = useState(false);
    const { watch } = useFormContextData();
    const formValues = watch();
    const debouncedFormValues = useDebouncedValue<FormValues>(formValues, 500);
    const windowWidth = useWindowWidth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (windowWidth < 1024) return null;

    return (
        <aside style={{ 
            border: "1px solid #e5e7eb", 
            borderRadius: 16, 
            padding: 20, 
            maxWidth: 480,
            background: "#ffffff",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}>
            <div style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #e5e7eb",
            }}>
                {debouncedFormValues.title && (
                    <div style={{ marginBottom: 16 }}>
                        <h2 style={{ 
                            fontSize: "20px", 
                            fontWeight: 700, 
                            margin: 0, 
                            marginBottom: 4,
                            color: "#111827",
                        }}>
                            {debouncedFormValues.title}
                        </h2>
                        {debouncedFormValues.author && (
                            <p style={{ 
                                fontSize: "14px", 
                                color: "#6b7280", 
                                margin: 0,
                            }}>
                                {debouncedFormValues.author}
                            </p>
                        )}
                    </div>
                )}

                {debouncedFormValues.status && (
                    <div style={{ marginBottom: 12 }}>
                        <span style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontSize: "12px",
                            fontWeight: 600,
                            background: getStatusColor(debouncedFormValues.status),
                            color: "#ffffff",
                        }}>
                            {getStatusLabel(debouncedFormValues.status)}
                        </span>
                    </div>
                )}

                {debouncedFormValues.rating > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <StarRating rating={debouncedFormValues.rating} />
                    </div>
                )}

                <div style={{ 
                    marginBottom: 16, 
                    fontSize: "13px", 
                    color: "#6b7280",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                }}>
                    {debouncedFormValues.publishedDate && (
                        <div>
                            <strong>출판일:</strong> {formatDate(debouncedFormValues.publishedDate)}
                        </div>
                    )}
                    {debouncedFormValues.startDate && (
                        <div>
                            <strong>시작일:</strong> {formatDate(debouncedFormValues.startDate)}
                        </div>
                    )}
                    {debouncedFormValues.endDate && (
                        <div>
                            <strong>종료일:</strong> {formatDate(debouncedFormValues.endDate)}
                        </div>
                    )}
                </div>

                {debouncedFormValues.recommended && (
                    <div style={{ 
                        marginBottom: 16,
                        padding: "8px 12px",
                        background: "#fef3c7",
                        borderRadius: 8,
                        fontSize: "13px",
                        color: "#92400e",
                        fontWeight: 600,
                    }}>
                        ⭐ 추천 도서
                    </div>
                )}

                {debouncedFormValues.review && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ 
                            fontSize: "13px", 
                            fontWeight: 600, 
                            color: "#374151",
                            marginBottom: 8,
                        }}>
                            독후감
                        </div>
                        <div style={{
                            fontSize: "13px",
                            color: "#4b5563",
                            lineHeight: 1.6,
                            maxHeight: 120,
                            overflow: "auto",
                            padding: 12,
                            background: "#ffffff",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                        }}>
                            {debouncedFormValues.review}
                        </div>
                    </div>
                )}

                {debouncedFormValues.quotes && debouncedFormValues.quotes.length > 0 && debouncedFormValues.quotes.some(q => q.text) && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ 
                            fontSize: "13px", 
                            fontWeight: 600, 
                            color: "#374151",
                            marginBottom: 8,
                        }}>
                            인용구 ({debouncedFormValues.quotes.filter(q => q.text).length}개)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {debouncedFormValues.quotes.filter(q => q.text).map((quote, index) => (
                                <div key={index} style={{
                                    padding: 12,
                                    background: "#ffffff",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    borderLeft: "3px solid #3b82f6",
                                }}>
                                    <div style={{
                                        fontSize: "13px",
                                        color: "#4b5563",
                                        lineHeight: 1.6,
                                        fontStyle: "italic",
                                        marginBottom: 4,
                                    }}>
                                        "{quote.text}"
                                    </div>
                                    {quote.page && (
                                        <div style={{
                                            fontSize: "11px",
                                            color: "#9ca3af",
                                        }}>
                                            p.{quote.page}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {debouncedFormValues.totalPages && (
                    <div style={{ 
                        fontSize: "13px", 
                        color: "#6b7280",
                        marginBottom: 12,
                    }}>
                        <strong>총 페이지:</strong> {debouncedFormValues.totalPages.toLocaleString()}페이지
                    </div>
                )}

                <div style={{
                    padding: "8px 12px",
                    background: debouncedFormValues.isPublic ? "#dbeafe" : "#f3f4f6",
                    borderRadius: 8,
                    fontSize: "13px",
                    color: debouncedFormValues.isPublic ? "#1e40af" : "#6b7280",
                    fontWeight: 600,
                    textAlign: "center",
                }}>
                    {debouncedFormValues.isPublic ? "🌐 공개" : "🔒 비공개"}
                </div>
            </div>
        </aside>
    );
}