import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/visual",
    fullyParallel: false,
    reporter: "list",
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
        colorScheme: "dark",
        locale: "en-US",
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
    },
    expect: {
        toHaveScreenshot: {
            animations: "disabled",
            caret: "hide",
            maxDiffPixels: 0,
        },
    },
    projects: [
        {
            name: "desktop",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 1000 },
                deviceScaleFactor: 1,
            },
        },
        {
            name: "mobile",
            use: {
                ...devices["Pixel 7"],
                viewport: { width: 412, height: 915 },
                deviceScaleFactor: 1,
            },
        },
    ],
});
