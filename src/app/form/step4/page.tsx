import Step4Form from "@/components/form/Step4Form";
import PreviewPane from "@/components/form/PreviewPane";

export default function Step4Page() {
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
        <h1>Step 4</h1>
        <Step4Form />
      </section>
      <PreviewPane />
    </main>
  );
}
