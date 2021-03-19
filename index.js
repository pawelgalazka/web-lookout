const puppeteer = require("puppeteer");
const notifier = require("node-notifier");
const config = require("./config");

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  while (true) {
    for (const { page, test } of config) {
      await page.goto(page);
      const message = await page.evaluate(test);
      if (message) {
        notifier.notify({
          title: "Web Lookout",
          message,
        });
      }
    }

    await timeout(30000);
  }

  await browser.close();
})();
