import StepSwitchCase from "@/components/form/StepSwitchCase";
import PreviewPane from "@/components/form/PreviewPane";

interface StepPageProps {
  params: Promise<{
    step: string;
  }> | {
    step: string;
  };
}

export default async function StepPage({ params }: StepPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const step = resolvedParams.step;

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
        <h1>Step {step.replace("step", "")}</h1>
        <StepSwitchCase step={step} />
      </section>
      <PreviewPane />
    </main>
  );
}

