import { Request, Response } from 'express';
import { getTutorResponse } from '../services/tutor.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const askTutor = async (req: Request, res: Response) => {
  try {
    const { message, examName, subjectName, mode, chatHistory } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return sendError(res, 'A message is required to ask the AI Tutor', 400);
    }

    const reply = await getTutorResponse({
      message,
      examName,
      subjectName,
      mode,
      chatHistory
    });

    return sendSuccess(res, 'AI Tutor response generated', { reply });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to process AI Tutor query', 500);
  }
};

