const twilio = require("twilio");

export async function sendMessage(phoneNumber: string) {
  const { TWILIO_AUTH, TWILIO_SID, TWILIO_NUMBER } = process.env;
  try {
    const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH);
    const response = await twilioClient.messages.create({
      body:
        "new vaccines available - sign up at https://am-i-eligible.covid19vaccine.health.ny.gov/",
      from: TWILIO_NUMBER,
      to: phoneNumber
    });

    if (!!response.sid) {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return false;
}
