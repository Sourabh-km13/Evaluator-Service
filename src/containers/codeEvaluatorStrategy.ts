export interface CodeEvaluationStrategy {
  execute(code: string, testCases: string): Promise<ExecutionResponseType>;
}
export type ExecutionResponseType = { output: string; status: string };
