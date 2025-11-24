"use client";

import { usePathname } from "next/navigation";
import { FormProviderWrapper } from "@/context/FormContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema } from "@/lib/schemas/step1Schema";
import { FormValues } from "@/context/FormContext";

export default function FormProviderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const step = pathname?.split("/").pop() || "";
    
    // step1일 때만 resolver 적용
    const resolver = step === "step1" 
        ? zodResolver(step1Schema)
        : undefined;
    
    return <FormProviderWrapper resolver={resolver}>{children}</FormProviderWrapper>;
}