import * as yup from 'yup';
import { TASK_STATUSES } from "../../constants";

// Input validation schema for create task
export const CreateTaskSchema = yup.object().shape({
  title: yup.string().required().min(3).max(255),
  description: yup.string().max(255)
});

// Input validation schema for update task
export const UpdateTaskSchema = yup.object().shape({
  id: yup.number(),
  newData: yup.object().shape({
    title: yup.string().notRequired().max(255),
    description: yup.string().notRequired().min(3).max(255),
    status: yup.string().notRequired().oneOf(Object.values(TASK_STATUSES))
  })
});