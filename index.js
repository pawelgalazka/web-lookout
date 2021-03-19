const puppeteer = require("puppeteer");
const notifier = require("node-notifier");
const config = require("./config");

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(msg) {
  console.log(`[${new Date().toLocaleString()}] ${msg}`);
}

const WAIT_VALUE_IN_SEC = 30;

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

    log(`Waiting for ${WAIT_VALUE_IN_SEC} sec`);
    await timeout(WAIT_VALUE_IN_SEC * 100);
  }

  await browser.close();
})();
