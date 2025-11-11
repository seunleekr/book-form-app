"use client";

import { useEffect, useState } from "react";

export function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState<number>(typeof window === "undefined" ? 1920: window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
}