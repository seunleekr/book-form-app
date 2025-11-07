"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useState } from "react";

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "css", prepend: true });
    cache.compat = true;
    return cache;
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

