import express from "express";
import addSubmission from "../../controllers/submissionController";
import { validateCreateSubmissionDto } from "../../validators/createSubmissionValidator";
import { CreateSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";

const submissionRouter = express.Router();

submissionRouter.post(
  "/",
  validateCreateSubmissionDto(CreateSubmissionZodSchema),
  addSubmission,
);

export default submissionRouter;
