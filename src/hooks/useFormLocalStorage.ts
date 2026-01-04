import { useEffect } from "react";
import { UseFormReturn, Path } from "react-hook-form";

export function useFormLocalStorageSync<T extends Record<string, any>>(
    methods: UseFormReturn<T>,
    storageKey: string,
    options?: {
        shouldValidate?: boolean;
    }
) {
    // load
    useEffect(() => {
        const saved = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach((key) => {
                    methods.setValue(key as Path<T>, parsed[key], {
                        shouldValidate: options?.shouldValidate ?? false
                    });
                });
            } catch (e) {
                // 파싱 실패 시 무시
            }
        }
    }, [methods, storageKey, options?.shouldValidate]);

    // save
    useEffect(() => {
        const sub = methods.watch((v) => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(v));
            } catch {
                // 저장 실패 시 무시
            }
        });
        return () => sub.unsubscribe();
    }, [methods, storageKey]);
}