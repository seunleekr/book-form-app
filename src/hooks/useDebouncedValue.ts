"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
}