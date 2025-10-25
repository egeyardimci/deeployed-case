import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import process from "process";

const appId = process.env.GITHUB_APP_ID;
const privateKey = fs.readFileSync(process.env.GITHUB_PRIVATE_KEY_PATH, "utf8");
const octokitCache = new Map();

async function getOctokit(installationId) {
  if (octokitCache.has(installationId)) {
    return octokitCache.get(installationId);
  }

  const auth = createAppAuth({
    appId,
    privateKey,
  });

  const installationAuthentication = await auth({
    type: "installation",
    installationId,
  });

  const octokit = new Octokit({
    auth: installationAuthentication.token,
  });

  octokitCache.set(installationId, octokit);
  return octokit;
}

export async function updatePRDescription(
  installationId,
  owner,
  repo,
  prNumber,
  description
) {
  const octokit = await getOctokit(installationId);

  return await octokit.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    body: description,
  });
}

export async function getPRDiff(installationId, owner, repo, prNumber) {
  const octokit = await getOctokit(installationId);

  const { data } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  return data;
}

export async function getPRCommits(installationId, owner, repo, prNumber) {
  const octokit = await getOctokit(installationId);

  const { data } = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number: prNumber,
  });

  return data;
}
