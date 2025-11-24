import Step1Form from "@/components/form/Step1Form";
import Step2Form from "@/components/form/Step2Form";
import Step3Form from "@/components/form/Step3Form";
import Step4Form from "@/components/form/Step4Form";
import Step5Form from "@/components/form/Step5Form";

interface StepSwitchCaseProps {
  step: string;
}

export default function StepSwitchCase({ step }: StepSwitchCaseProps) {
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
}

