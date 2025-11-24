import StepSwitchCase from "@/components/form/StepSwitchCase";
import PreviewPane from "@/components/form/PreviewPane";

interface StepPageProps {
  params: Promise<{
    step: string;
  }> | {
    step: string;
  };
}

const mainStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 420px",
  gap: "24px",
  alignItems: "flex-start",
};

export default async function StepPage({ params }: StepPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const step = resolvedParams.step;
  const stepNumber = step.replace("step", "");

  return (
    <main style={mainStyle}>
      <section>
        <h1>Step {stepNumber}</h1>
        <StepSwitchCase step={step} />
      </section>
      <PreviewPane />
    </main>
  );
}

