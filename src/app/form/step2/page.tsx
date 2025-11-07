import Step2Form from "@/components/form/Step2Form";
import PreviewPane from "@/components/form/PreviewPane";

export default function Step2Page() {
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
      <h1>Step 2</h1>
      <Step2Form />
      </section>
      <PreviewPane />
    </main>
  );
}
