import { PR_DESCRIPTION_SYSTEM_PROMPT } from "../constants";
import { getPRCommits, getPRDiff } from "./githubAPIService";
import { callLLMService } from "./llmService";

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
  const systemPrompt = PR_DESCRIPTION_SYSTEM_PROMPT;
  const userQuery = generatePRPrompt(context);

  const llmResponse = await callLLMService(systemPrompt, userQuery);
  return llmResponse;
};

const generatePRPrompt = (context) => {
  return `Generate a pull request description based on the following information:

**PR Title:** ${context.title}
**Author:** ${context.author}
**Base Branch:** ${context.baseBranch}
**Head Branch:** ${context.headBranch}

**Statistics:**
- ${context.stats.additions} additions
- ${context.stats.deletions} deletions
- ${context.stats.changedFiles} file(s) changed
- ${context.stats.commits} commit(s)

**Commit Messages:**
\`\`\`
${context.commitMessages}
\`\`\`

**Code Changes (Unified Diff):**
\`\`\`diff
${context.diff}
\`\`\`

Please generate a clear, professional PR description following the guidelines provided.`;
};
