export const webhookController = async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({
      message: "Error processing webhook",
      error: error.message,
    });
  }
};
