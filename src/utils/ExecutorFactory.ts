import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";

export default function createExecutor(codeLanguage: string) {
  if (codeLanguage === "PYTHON") {
    const pythonExecutor = new PythonExecutor();
    return pythonExecutor;
  } else if (codeLanguage === "CPP") {
    const cppExecutor = new CppExecutor();
    return cppExecutor;
  } else if (codeLanguage === "JAVA") {
    const javaExecutor = new JavaExecutor();
    return javaExecutor;
  } else {
    return null;
  }
}
