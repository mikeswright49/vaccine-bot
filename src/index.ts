import { UserStore } from "./stores/user-store";
import { spawnSync } from "child_process";
async function main() {
  console.log("Starting scan of pages for updates");
  try {
    const { USERNAME, PASSWORD } = process.env;
    await UserStore.init(USERNAME, PASSWORD);
    const users = await UserStore.getUsers();
    const ONE_DAY_AGO = new Date();
    ONE_DAY_AGO.setDate(new Date().getDate() - 1);
    const usersToCheck = users.filter(
      user =>
        !user.vaccinated &&
        (!user.notified ||
          (user.notified && new Date(user.last_notified) > ONE_DAY_AGO))
    );
    usersToCheck.forEach((user: { id: string }) => {
      const ls = spawnSync(
        `node`,
        [
          "node_modules/testcafe/bin/testcafe.js",
          "chrome:headless",
          "dist/scan-page.js"
        ],
        {
          encoding: "utf8",
          stdio: "pipe",
          cwd: process.cwd(),
          env: {
            ...process.env,
            USER_ID: user.id
          }
        }
      );
      if (ls.error) {
        console.log(ls.error);
      } else {
        console.log(ls.output.filter(x => !!x).join("\n"));
      }
    });
  } catch (e) {
    console.error(e);
  }
  console.log("Complete");
  process.exit();
}
main();
