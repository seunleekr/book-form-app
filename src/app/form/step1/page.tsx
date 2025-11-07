import Step1Form from "@/components/form/Step1Form";
import PreviewPane from "@/components/form/PreviewPane";

export default function Step1Page() {
  return (
    <main
     style={{
      display: "grid",
      gridTemplateColumns: "1fr 420px",
      gap: "24px",
      alignItems: "flex-start",
     }}
     >
      <section>
      <h1>Step 1</h1>
      <Step1Form />
      </section>
      <PreviewPane />
    </main>
  );
}
