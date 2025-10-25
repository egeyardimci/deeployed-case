import { updatePRDescription } from "./githubAPIService";
import { generatePRDescription } from "./prDescriptionService";

export const webhookService = async (req) => {
  const { action, pull_request } = req.body;

  // Only handle PR opened events
  if (action === "opened") {
    const description = await generatePRDescription(pull_request);
    await updatePRDescription(pull_request, description);
    return { success: true, message: "PR description updated" };
  } else {
    return {
      success: false,
      message: "Webhook skipped: not a PR opened event",
    };
  }
};
