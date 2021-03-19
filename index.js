const puppeteer = require("puppeteer");
const notifier = require("node-notifier");
const config = require("./config");

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(msg) {
  console.log(`[${new Date().toLocaleString()}] ${msg}`);
}

const WAIT_VALUE = 5;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  while (true) {
    for (const { url, test } of config) {
      log(`Checking ${url}`);
      await page.goto(url);
      const message = await page.evaluate(test);
      if (message) {
        notifier.notify({
          title: "Web Lookout",
          message,
          sticky: true,
          open: url,
        });
      }
    }

    log(`Waiting for ${WAIT_VALUE} ${WAIT_VALUE === 1 ? "minute" : "minutes"}`);
    await timeout(WAIT_VALUE * 60 * 1000);
  }

  await browser.close();
})();
