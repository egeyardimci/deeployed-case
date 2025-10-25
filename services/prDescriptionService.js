import { getPRCommits, getPRDiff } from "./githubAPIService";

export const generatePRDescription = async (
  installationId,
  owner,
  repo,
  pull_request
) => {
  // 1. Get PR diff and commits
  const [diff, commits] = await Promise.all([
    getPRDiff(installationId, owner, repo, pull_request.number),
    getPRCommits(installationId, owner, repo, pull_request.number),
  ]);

  // 2. Prepare context for LLM
  const context = {
    title: pull_request.title,
    author: pull_request.user.login,
    baseBranch: pull_request.base.ref,
    headBranch: pull_request.head.ref,
    stats: {
      additions: pull_request.additions,
      deletions: pull_request.deletions,
      changedFiles: pull_request.changed_files,
    },
    commitMessages: commits.map((c) => c.commit.message).join("\n"),
    diff: diff,
  };

  // 3. Generate description with LLM
  const description = await generatePRDescriptionWithLLM(context);
  return description;
};

const generatePRDescriptionWithLLM = async (context) => {
  // Placeholder for LLM integration
  // In a real implementation, this would call an LLM API like OpenAI's GPT
  return `Generated PR Description based on context: ${JSON.stringify(
    context
  )}`;
};
