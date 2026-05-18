import { handleCodeTask } from "./_shared.js";

export default function handler(request, response) {
  return handleCodeTask(request, response, "optimize");
}
