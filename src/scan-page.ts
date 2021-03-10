import { Selector } from "testcafe";
import { sendMessage } from "./send-message";
import { UserStore } from "./stores/user-store";

fixture(`Scan landing page`).page(
  "https://am-i-eligible.covid19vaccine.health.ny.gov/"
);

test("Checking page status", async t => {
  const { USERNAME, PASSWORD, USER_ID } = process.env;
  await UserStore.init(USERNAME, PASSWORD);
  const user = await UserStore.getUser(USER_ID);
  if (!user) {
    return;
  }

  const table = Selector("#statePods_table");
  const rows = table.find("td").withText(new RegExp(user.location_regex, "gi"));
  await t.expect(rows.exists).ok();
  if (await rows.sibling().withExactText("Appointments Available").exists) {
    console.log("Appointments found");
    const notified = await sendMessage(user.phone_number);
    UserStore.updateUser({
      ...user,
      notified,
      last_notified: new Date().toISOString()
    });
  } else {
    console.log("No luck");
    UserStore.updateUser({ ...user, notified: false, last_notified: null });
  }
});
