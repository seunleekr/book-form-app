"use client";

import { useState, useEffect } from "react";
import { useFormContextData } from "@/context/FormContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useWindowWidth } from "@/hooks/useWindowW";
import { FormValues } from "@/context/FormContext";

export default function PreviewPane() {
    const [isMounted, setIsMounted] = useState(false);
    const { watch } = useFormContextData();
    const live = watch();
    const data = useDebouncedValue<FormValues>(live, 500);
    const w = useWindowWidth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (w < 1024) return null;

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

    const renderStars = (rating: number) => {
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
    };

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
                marginBottom: 12, 
                fontSize: "14px", 
                color: "#6b7280",
                fontWeight: 500,
            }}>
                앱 미리보기 (500ms 딜레이)
            </div>
            
            <div style={{
                background: "#f9fafb",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #e5e7eb",
            }}>
                {/* 책 제목 및 저자 */}
                {data.title && (
                    <div style={{ marginBottom: 16 }}>
                        <h2 style={{ 
                            fontSize: "20px", 
                            fontWeight: 700, 
                            margin: 0, 
                            marginBottom: 4,
                            color: "#111827",
                        }}>
                            {data.title}
                        </h2>
                        {data.author && (
                            <p style={{ 
                                fontSize: "14px", 
                                color: "#6b7280", 
                                margin: 0,
                            }}>
                                {data.author}
                            </p>
                        )}
                    </div>
                )}

                {/* 상태 배지 */}
                {data.status && (
                    <div style={{ marginBottom: 12 }}>
                        <span style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 12,
                            fontSize: "12px",
                            fontWeight: 600,
                            background: getStatusColor(data.status),
                            color: "#ffffff",
                        }}>
                            {getStatusLabel(data.status)}
                        </span>
                    </div>
                )}

                {/* 별점 */}
                {data.rating > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        {renderStars(data.rating)}
                    </div>
                )}

                {/* 날짜 정보 */}
                <div style={{ 
                    marginBottom: 16, 
                    fontSize: "13px", 
                    color: "#6b7280",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                }}>
                    {data.publishedDate && (
                        <div>
                            <strong>출판일:</strong> {formatDate(data.publishedDate)}
                        </div>
                    )}
                    {data.startDate && (
                        <div>
                            <strong>시작일:</strong> {formatDate(data.startDate)}
                        </div>
                    )}
                    {data.endDate && (
                        <div>
                            <strong>종료일:</strong> {formatDate(data.endDate)}
                        </div>
                    )}
                </div>

                {/* 추천 여부 */}
                {data.recommended && (
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

                {/* 리뷰 미리보기 */}
                {data.review && (
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
                            {data.review}
                        </div>
                    </div>
                )}

                {/* 인용구 */}
                {data.quotes && data.quotes.length > 0 && data.quotes.some(q => q.text) && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ 
                            fontSize: "13px", 
                            fontWeight: 600, 
                            color: "#374151",
                            marginBottom: 8,
                        }}>
                            인용구 ({data.quotes.filter(q => q.text).length}개)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {data.quotes.filter(q => q.text).map((quote, index) => (
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

                {/* 총 페이지 수 */}
                {data.totalPages && (
                    <div style={{ 
                        fontSize: "13px", 
                        color: "#6b7280",
                        marginBottom: 12,
                    }}>
                        <strong>총 페이지:</strong> {data.totalPages.toLocaleString()}페이지
                    </div>
                )}

                {/* 공개/비공개 */}
                <div style={{
                    padding: "8px 12px",
                    background: data.isPublic ? "#dbeafe" : "#f3f4f6",
                    borderRadius: 8,
                    fontSize: "13px",
                    color: data.isPublic ? "#1e40af" : "#6b7280",
                    fontWeight: 600,
                    textAlign: "center",
                }}>
                    {data.isPublic ? "🌐 공개" : "🔒 비공개"}
                </div>
            </div>
        </aside>
    );
}