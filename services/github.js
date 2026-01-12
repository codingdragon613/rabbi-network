import { Octokit } from "@octokit/rest";

export class GitHubService {
    constructor(token) {
        this.octokit = new Octokit({
            auth: token,
        });
        // Parse owner/repo and path from current location or config
        // For simplicity, we'll assume a standard structure or ask user to input/hardcode during initialization if needed.
        // However, since we are deployed, we can guess the repo from the URL if it's github.io
        // user.github.io/repo-name

        // Default fallback (update these if needed or pass in constructor)
        this.owner = 'codingdragon613';
        this.repo = 'rabbi-network';
        this.path = 'public/data.json';
    }

    async getFileSha() {
        try {
            const response = await this.octokit.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path: this.path,
            });
            return response.data.sha;
        } catch (error) {
            console.error("Error fetching SHA:", error);
            throw error;
        }
    }

    async saveData(content, message = "Update data via Admin Panel") {
        try {
            const sha = await this.getFileSha();

            // Content must be base64 encoded
            const contentEncoded = btoa(JSON.stringify(content, null, 2)); // simple base64 for utf8 text

            await this.octokit.repos.createOrUpdateFileContents({
                owner: this.owner,
                repo: this.repo,
                path: this.path,
                message: message,
                content: contentEncoded,
                sha: sha,
            });
            return true;
        } catch (error) {
            console.error("Error saving data:", error);
            throw error;
        }
    }
}
