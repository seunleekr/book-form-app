import Step3Form from "@/components/form/Step3Form";
import PreviewPane from "@/components/form/PreviewPane";

export default function Step3Page() {
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
        <h1>Step 3</h1>
      <Step3Form />
      </section>
      <PreviewPane />
    </main>
  );
}
