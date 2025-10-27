# GitHub PR Auto-Description Bot

This project is a webhook bot that automatically enriches GitHub Pull Requests with descriptions. When a PR is opened, the bot automatically analyzes commit messages and code changes, using an LLM (Groq) to generate a professional PR description.

Live deployed at https://deeployed-case-latest.onrender.com, go to the link and make sure the server is not sleeping (Railway free tier) then open PR to https://github.com/egeyardimci/deeployed-case-test and try!

Sample PR: https://github.com/egeyardimci/deeployed-case-test/pull/3

## Features

- Automatically triggers when a GitHub Pull Request is opened
- Analyzes commit messages and diffs
- Generates professional PR descriptions using Groq LLM API
- Works as a GitHub App providing secure integration
- Easy deployment with Docker support

## Requirements

- [Bun](https://bun.sh) v1.3.1 or higher
- GitHub App credentials
- Groq API key
- (Optional) Docker - for running as a container

## Installation

### 1. Clone the Project

```bash
git clone <repo-url>
cd deeployed-case
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Create a GitHub App

1. Go to [Settings > Developer settings > GitHub Apps](https://github.com/settings/apps) in your GitHub account
2. Click the "New GitHub App" button
3. Configure the following settings:

**General Settings:**

- **GitHub App name:** Choose a unique name (e.g., `pr-description-bot-yourname`)
- **Homepage URL:** `http://localhost:3000` (or your production URL)
- **Webhook URL:** Enter your Smee.io URL (you'll create this in the next step)
- **Webhook secret:** (optional) Set a webhook secret

**Permissions:**

- **Repository permissions:**
  - `Pull requests`: Read & Write
  - `Contents`: Read
  - `Metadata`: Read

**Subscribe to events:**

- Select the `Pull request` event

4. Click the "Create GitHub App" button
5. After the app is created:
   - Note the **App ID**
   - Click "Generate a private key" to download the private key
   - Save the private key file (`*.pem`) to the project root directory as `private-key.pem`

### 4. Install the GitHub App to a Repository

1. Go to the "Install App" tab on your GitHub App page
2. Select the account/organization you want to test with
3. Grant access to all repositories or selected repositories
4. Click the "Install" button

### 5. Get a Groq API Key

1. Go to [Groq Console](https://console.groq.com)
2. Create an account/sign in
3. Create a new API key from the API Keys section
4. Copy the API key

### 6. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
GITHUB_APP_ID=123456                              # Your GitHub App ID
GITHUB_PRIVATE_KEY_PATH=./private-key.pem         # Private key file path
GROQ_API_KEY=your-groq-api-key-here              # Your Groq API key
SMEE_URL=your-smee-url                            # Your SMEE URL
```

## Running

### Local Development

#### Method 1: Run Directly with Bun

```bash
bun run index.js
```

The server will start at `http://localhost:3000`.

#### Method 2: Run with Docker Compose (Recommended)

1. Make sure your `.env` file is configured with all required variables
2. Ensure your `private-key.pem` file is in the project root
3. Run with Docker Compose:

```bash
docker-compose up -d
```

To view logs:

```bash
docker-compose logs -f
```

To stop the container:

```bash
docker-compose down
```

#### Method 3: Run with Docker

1. Build the Docker image:

```bash
docker build -t pr-description-bot .
```

2. Run the container:

**Linux/Mac:**

```bash
docker run -p 3000:3000 \
  -e GITHUB_APP_ID=your_app_id \
  -e GITHUB_PRIVATE_KEY_PATH=./private-key.pem \
  -e GROQ_API_KEY=your_groq_api_key \
  -e SMEE_URL=your_smee_url \
  -v $(pwd)/private-key.pem:/app/private-key.pem \
  pr-description-bot
```

**Windows PowerShell:**

```bash
docker run -d `
  -e GITHUB_APP_ID=your_app_id `
  -e GITHUB_PRIVATE_KEY_PATH=./private-key.pem `
  -e GROQ_API_KEY=your_groq_api_key `
  -e SMEE_URL=your_smee_url `
  -v ${PWD}/private-key.pem:/app/private-key.pem `
  pr-description-bot
```

**Note:** When running with Docker, don't forget to mount the private key file as a volume.

## Webhook Setup

You need to use Smee.io to forward GitHub webhooks to your local development environment.

### 1. Create a Smee.io Channel

1. Go to [https://smee.io](https://smee.io)
2. Click the "Start a new channel" button
3. Copy the URL provided (e.g., `https://smee.io/abc123xyz`)

### 2. Install and Run Smee Client

```bash
npm install -g smee-client

# Run the Smee client
smee --url https://smee.io/YOUR_SMEE_URL --path /webhook --port 3000
```

This command will forward webhook requests from Smee.io to `http://localhost:3000/webhook`.

### 3. Update GitHub App Webhook URL

1. Return to your GitHub App settings
2. Enter your Smee.io URL in the "Webhook URL" field
3. Click the "Save changes" button

### 4. Test

1. Create a new branch in a repository where you installed the app
2. Make some changes and commit
3. Open a new Pull Request
4. The bot will automatically update the PR description

You'll see these messages in the console logs:

```
Server running at http://localhost:3000
Webhook received: PR opened
PR description updated successfully
```

## Testing

To test the project:

```bash
# Run all tests
bun test

# Test in watch mode
bun run test:watch

# Test with coverage report
bun run test:coverage
```

For detailed information about the test suite, test structure, and writing new tests, see the [Tests Documentation](tests/README.md).

## Project Structure

```
deeployed-case/
├── index.js                          # Main application entry point
├── constants.js                      # Constants and system prompts
├── routes/
│   └── webhookRoute.js              # Webhook endpoint route
├── services/
│   ├── webhookService.js            # Webhook business logic
│   ├── prDescriptionService.js      # PR description generation
│   ├── githubAPIService.js          # GitHub API calls
│   └── llmService.js                # Groq LLM integration
├── tests/
│   └── unit/                        # Unit tests
├── .env                             # Environment variables (not in git)
├── .env.example                     # Example environment variables
├── private-key.pem                  # GitHub App private key (not in git)
├── Dockerfile                       # Docker container definition
└── package.json                     # Project dependencies
```

## How It Works

1. When a Pull Request is opened, GitHub triggers a webhook
2. The bot retrieves the PR's commit messages and diff
3. It sends this information to Groq LLM to generate a professional description
4. The generated description is written to the PR using the GitHub API

## Technical Details

- **Runtime:** Bun (fast JavaScript runtime)
- **Framework:** Express.js
- **GitHub Integration:** Octokit (GitHub REST API v3)
- **LLM Provider:** Groq (llama-3.3-70b-versatile model)
- **Authentication:** GitHub App installation tokens

## Troubleshooting

### "Private key not found" error

- Make sure the `private-key.pem` file is in the project root directory
- Check that the `GITHUB_PRIVATE_KEY_PATH` in the `.env` file is correct

### "Invalid credentials" error

- Make sure your GitHub App ID is correct
- Verify that the private key file belongs to the correct GitHub App
- Ensure the GitHub App is installed on the relevant repository

### Webhook not triggering

- Make sure the Smee client is running
- Verify that the GitHub App webhook URL is your Smee.io URL
- Ensure the GitHub App is subscribed to the "Pull request" event
- Make sure the bot application is running (`http://localhost:3000`)

### LLM not responding

- Make sure your Groq API key is valid
- Check your internet connection
- Check Groq API limits (rate limiting)

## License

This project was developed for educational purposes.
