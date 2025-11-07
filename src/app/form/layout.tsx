import { FormProviderWrapper } from "@/context/FormContext";

export default function FormLayout({ children }: { children: React.ReactNode }) {
    return <FormProviderWrapper>{children}</FormProviderWrapper>;
}