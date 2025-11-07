import Step5Form from "@/components/form/Step5Form";
import PreviewPane from "@/components/form/PreviewPane";

export default function Step5Page() {
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
        <h1>Step 5</h1>
        <Step5Form />
      </section>
      <PreviewPane />
    </main>
  );
}
