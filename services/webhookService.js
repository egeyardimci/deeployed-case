import { updatePRDescription } from "./githubAPIService";
import { generatePRDescription } from "./prDescriptionService";

export const webhookService = async (req) => {
  const { action, pull_request, repository, installation } = req.body;

  // Only handle PR opened events
  if (action === "opened") {
    const description = await generatePRDescription(
      installation.id,
      repository.owner.login,
      repository.name,
      pull_request
    );
    await updatePRDescription(
      installation.id,
      repository.owner.login,
      repository.name,
      pull_request.number,
      description
    );
    return { success: true, message: "PR description updated" };
  } else {
    return {
      success: false,
      message: "Webhook skipped: not a PR opened event",
    };
  }
};
