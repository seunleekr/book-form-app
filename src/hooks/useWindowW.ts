"use client";

import { useEffect, useState } from "react";

export function useWindowWidth() {
    const [w, setW] = useState<number>(typeof window === "undefined" ? 1920: window.innerWidth);

    useEffect(() => {
        const onR = () => setW(window.innerWidth);
        window.addEventListener("resize", onR);
        return () => window.removeEventListener("resize", onR);
    }, []);

    return w;
}