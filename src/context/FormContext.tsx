"use client";

import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { useForm, FormProvider, UseFormReturn, Resolver } from "react-hook-form";

export type FormValues = {
    title: string;
    author: string;
    status: "to_read" | "reading" | "finished" | "on_hold" | "" ;
    publishedDate: string;
    startDate?: string;
    endDate?: string;
    recommended: boolean;
    rating: number;
    review?: string;
    quotes: { text: string; page?: number }[];
    totalPages: number;
    isPublic: boolean;
};

const KEY = "multi-step-form:v1";

const FormContext = createContext<UseFormReturn<FormValues> | null>(null);
const ResolverContext = createContext<{
    setResolver: (resolver: Resolver<FormValues> | undefined) => void;
} | null>(null);

export function FormProviderWrapper({ children }: { children: React.ReactNode }) {
    const defaults: FormValues = {
        title: "", author: "", status: "", publishedDate: "", startDate: "", endDate: "", 
        recommended: false, rating: 0, review: "",
        quotes: [{ text: "", page: 1 }], totalPages: 300, 
        isPublic: false,
    };
    
    const [resolver, setResolverState] = useState<Resolver<FormValues> | undefined>(undefined);
    
    const methods = useForm<FormValues>({ 
        defaultValues: defaults, 
        mode: "onChange",
        resolver,
    });
    
    const setResolver = useCallback((newResolver: Resolver<FormValues> | undefined) => {
        setResolverState(newResolver);
    }, []);

    useEffect(() => {
        const saved = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.keys(parsed).forEach((key) => {
                    methods.setValue(key as keyof FormValues, parsed[key], { shouldValidate: false });
                });
            } catch (e) {
            }
        }
    }, [methods]);

    useEffect(() => {
        const sub = methods.watch((v) => {
            try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
        });
        return () => sub.unsubscribe();
    }, [methods]);

    return ( 
        <FormContext.Provider value={methods}>
            <ResolverContext.Provider value={{ setResolver }}>
                <FormProvider {...methods}>{children}</FormProvider>
            </ResolverContext.Provider>
        </FormContext.Provider>
    );
}
export function useFormContextData() {
    const ctx = useContext(FormContext);
    if (!ctx) { throw new Error("useFormContext must be used within a FormProviderWrapper");}
    return ctx;
}

export function useResolverContext() {
    const ctx = useContext(ResolverContext);
    if (!ctx) { throw new Error("useResolverContext must be used within a FormProviderWrapper");}
    return ctx;
}