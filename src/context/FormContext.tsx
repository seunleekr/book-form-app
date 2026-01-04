"use client";

import { createContext, useContext } from "react";
import { useForm, FormProvider, UseFormReturn, Resolver } from "react-hook-form";
import { useFormLocalStorageSync } from "@/hooks/useFormLocalStorage";

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

export function FormProviderWrapper({ children, resolver }: { children: React.ReactNode; resolver?: Resolver<FormValues> }) {
    const defaults: FormValues = {
        title: "", author: "", status: "", publishedDate: "", startDate: "", endDate: "",
        recommended: false, rating: 0, review: "",
        quotes: [{ text: "", page: 1 }], totalPages: 300,
        isPublic: false,
    };

    const methods = useForm<FormValues>({
        defaultValues: defaults,
        mode: "onChange",
        shouldFocusError: true,
        resolver,
    });

    // localStorage 동기화 책임을 훅에 위임
    useFormLocalStorageSync(methods, KEY);

    return (
        <FormContext.Provider value={methods}>
            <FormProvider {...methods}>{children}</FormProvider>
        </FormContext.Provider>
    );
}
export function useFormContextData() {
    const ctx = useContext(FormContext);
    if (!ctx) { throw new Error("useFormContext must be used within a FormProviderWrapper");}
    return ctx;
}