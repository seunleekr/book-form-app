"use client";

import { useState, useEffect } from "react";
import { useFormContextData } from "@/context/FormContext";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useWindowWidth } from "@/hooks/useWindowW";

export default function PreviewPane() {
    const [isMounted, setIsMounted] = useState(false);
    const { watch } = useFormContextData();
    const live = watch();
    const data = useDebouncedValue(live, 500);
    const w = useWindowWidth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (w < 1024) return null;

    return (
        <aside style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, maxWidth: 480 }}>
            <h3 style={{marginBottom: 8}}>미리보기 (500ms 딜레이)</h3>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 12 }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </aside>
    );
}