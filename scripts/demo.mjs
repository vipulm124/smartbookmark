import { chromium } from "playwright";
import path from "path";

const ARTIFACTS = "/opt/cursor/artifacts";
const BASE = "http://localhost:8081";

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await wait(1500);
  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshot_empty_state.png"),
    fullPage: true,
  });

  await page.getByTestId("load-demo").click();
  await wait(1500);
  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshot_all_bookmarks.png"),
    fullPage: true,
  });

  await page.getByTestId("filter-technical").click();
  await wait(800);
  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshot_technical_filter.png"),
    fullPage: true,
  });

  await page.getByTestId("filter-entertainment").click();
  await wait(800);
  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshot_entertainment_filter.png"),
    fullPage: true,
  });

  await page.getByTestId("filter-all").click();
  await wait(500);
  await page.getByText("React — A JavaScript library").first().click();
  await wait(1200);
  await page.screenshot({
    path: path.join(ARTIFACTS, "screenshot_bookmark_detail.png"),
    fullPage: true,
  });

  await context.close();
  await browser.close();
  console.log("Demo screenshots saved to", ARTIFACTS);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
