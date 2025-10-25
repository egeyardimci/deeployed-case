import { webhookService } from "../services/webhookService.js";

export const webhookController = async (req, res) => {
  try {
    res.status(200).json({
      data: webhookService(req.body),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing webhook",
      error: error,
    });
  }
};
