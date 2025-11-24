import { FormProviderWrapper } from "@/context/FormContext";

export default function FormProviderLayout({ children }: { children: React.ReactNode }) {
    return <FormProviderWrapper>{children}</FormProviderWrapper>;
}