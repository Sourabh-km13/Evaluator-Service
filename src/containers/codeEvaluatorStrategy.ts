export interface CodeEvaluationStrategy {
  execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponseType>;
}
export type ExecutionResponseType = { output: string; status: string };
