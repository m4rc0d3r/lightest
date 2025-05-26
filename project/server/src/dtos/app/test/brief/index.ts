export interface BriefTest {
  id: number;
  title: string;
  numberOfQuestions: number;
  grade: number;
}

export interface BriefPassedTest extends BriefTest {
  score: number;
}
