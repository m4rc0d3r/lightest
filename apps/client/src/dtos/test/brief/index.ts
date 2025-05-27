type BriefTest = {
  id: number;
  title: string;
  numberOfQuestions: number;
  grade: number;
};

type BriefPassedTest = {
  score: number;
} & BriefTest;

export type { BriefPassedTest, BriefTest };
