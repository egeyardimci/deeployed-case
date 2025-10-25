export const updatePRDescription = async (pull_request, description) => {
  console.log(
    `Updating PR #${pull_request.id} with description:\n${description}`
  );
};
