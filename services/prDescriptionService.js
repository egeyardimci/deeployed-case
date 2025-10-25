export const generatePRDescription = async (pull_request) => {
  // 1. Fetch the diff
  const diffResponse = await fetch(pull_request.diff_url);
  const diffText = await diffResponse.text();

  // 2. Fetch commit messages
  const commitsResponse = await fetch(pull_request.commits_url);
  const commits = await commitsResponse.json();
  const commitMessages = commits.map((c) => c.commit.message).join("\n");

  // 3. Prepare context for LLM
  const context = {
    title: pull_request.title,
    author: pull_request.user.login,
    baseBranch: pull_request.base.ref,
    headBranch: pull_request.head.ref,
    stats: {
      additions: pull_request.additions,
      deletions: pull_request.deletions,
      changedFiles: pull_request.changed_files,
      commits: pull_request.commits,
    },
    commitMessages,
    diff: diffText,
  };

  // 4. Generate description with LLM
  console.log("PR context:", context);
  return "some description";
};
