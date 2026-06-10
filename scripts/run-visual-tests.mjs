import { spawn, spawnSync } from "node:child_process";

const candidateUrls = ["http://127.0.0.1:3000", "http://127.0.0.1:3100"];
const requestedArgs = process.argv.slice(2);
let serverProcess;

async function isReady(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
}

async function waitForServer(url) {
    const deadline = Date.now() + 120_000;

    while (Date.now() < deadline) {
        if (serverProcess?.exitCode !== null) {
            throw new Error(`Next.js exited before ${url} became ready.`);
        }
        if (await isReady(url)) return;
        await new Promise((resolve) => setTimeout(resolve, 250));
    }

    throw new Error(`Timed out waiting for ${url}.`);
}

function stopServer() {
    if (!serverProcess?.pid) return;

    if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(serverProcess.pid), "/T", "/F"], {
            stdio: "ignore",
        });
    } else {
        process.kill(-serverProcess.pid, "SIGTERM");
    }
}

let baseURL;
for (const url of candidateUrls) {
    if (await isReady(url)) {
        baseURL = url;
        break;
    }
}

if (!baseURL) {
    baseURL = candidateUrls[1];
    serverProcess = spawn(
        process.execPath,
        ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3100"],
        {
            stdio: "inherit",
            detached: process.platform !== "win32",
        },
    );
    await waitForServer(baseURL);
}

const playwright = spawn(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test", ...requestedArgs],
    {
        stdio: "inherit",
        env: { ...process.env, PLAYWRIGHT_BASE_URL: baseURL },
    },
);

const exitCode = await new Promise((resolve) => {
    playwright.on("exit", (code) => resolve(code ?? 1));
});

stopServer();
process.exit(exitCode);
