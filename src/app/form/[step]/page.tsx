import PreviewPane from "@/components/form/PreviewPane";
import Step1Form from "@/components/form/Step1Form";
import Step2Form from "@/components/form/Step2Form";
import Step3Form from "@/components/form/Step3Form";
import Step4Form from "@/components/form/Step4Form";
import Step5Form from "@/components/form/Step5Form";

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

  const renderStepForm = () => {
    switch (step) {
      case "step1":
        return <Step1Form />;
      case "step2":
        return <Step2Form />;
      case "step3":
        return <Step3Form />;
      case "step4":
        return <Step4Form />;
      case "step5":
        return <Step5Form />;
      default:
        return <div>Invalid step</div>;
    }
  };

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
        {renderStepForm()}
      </section>
      <PreviewPane />
    </main>
  );
}
