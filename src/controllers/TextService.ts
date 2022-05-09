import type { Twilio } from "twilio";
import twilio from "twilio";
import logger from "../log";

class TextService {
  client: Twilio | undefined;

  constructor() {
    const accountSid = process.env.TWILIO_SID!;
    const authToken = process.env.TWILIO_AUTH!;
    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    }
  }

  sendText = async (message: string) => {
    if (!this.client) {
      return;
    }
    try {
      const sent = await this.client.messages.create({
        body: message,
        to: process.env.TO_NUMBER!,
        from: process.env.TWILIO_NUMBER!,
      });
      if (sent.errorMessage) {
        logger.error(`Error sending text with error: ${sent.errorMessage}`);
      } else {
        logger.info(`Sent text message to: ${sent.to}`);
      }
    } catch (err) {
      logger.error(`Error sending text with error: ${err}`);
    }
  };
}

export default TextService;
