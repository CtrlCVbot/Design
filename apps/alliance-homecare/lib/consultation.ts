export type DemoConsultationState = {
  status: "submitted";
  message: string;
};

export function createDemoConsultationState(): DemoConsultationState {
  return { status: "submitted", message: "신청이 접수되었습니다" };
}

export function getNextOpenFaq(openFaq: number | null, nextFaq: number): number | null {
  return openFaq === nextFaq ? null : nextFaq;
}
