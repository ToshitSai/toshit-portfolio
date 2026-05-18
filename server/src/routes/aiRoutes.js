import { Router } from "express";
import { runCodeTask } from "../services/openaiService.js";
import { validateCodeRequest } from "../utils/validation.js";

const router = Router();

const taskConfig = {
  explain: {
    mode: "explain",
    endpoint: "/explain"
  },
  convert: {
    mode: "convert",
    endpoint: "/convert"
  },
  debug: {
    mode: "debug",
    endpoint: "/debug"
  },
  optimize: {
    mode: "optimize",
    endpoint: "/optimize"
  }
};

Object.values(taskConfig).forEach(({ endpoint, mode }) => {
  router.post(endpoint, async (req, res, next) => {
    try {
      const payload = validateCodeRequest(req.body, mode);
      const output = await runCodeTask(mode, payload);
      res.json({ output });
    } catch (error) {
      next(error);
    }
  });
});

export default router;
