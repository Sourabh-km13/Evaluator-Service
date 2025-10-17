function CodeCreator(
  firstStub: string,
  middleStub: string,
  endStub?: string,
): string {
  return `
    ${firstStub}
    ${middleStub}
    ${endStub || ""}
    `;
}
export default CodeCreator;
