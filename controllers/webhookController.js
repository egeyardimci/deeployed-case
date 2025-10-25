import { webhookService } from "../services/webhookService.js";

export const webhookController = async (req, res) => {
  try {
    await webhookService(req);
    res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing webhook",
      error: error,
    });
  }
};
