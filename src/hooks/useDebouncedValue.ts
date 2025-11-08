"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 500) {
    const [v, setV] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return v;
}