import { webhookService } from "../services/webhookService.js";

export const webhookController = async (req, res) => {
  try {
    const result = await webhookService(req);
    res.status(200).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing webhook!",
      error: error.message,
    });
  }
};
