// const formatMobile = (phone) => {
//   let clean = phone.replace(/\D/g, ""); // remove non-digits
//   if (clean.startsWith("91")) {
//     return clean; // already has country code
//   }
//   return `91${clean}`; // add if missing
// };

// export const sendBookingConfirmationSMS = async (phone, smsData) => {
//   try {
//     const mobile = formatMobile(phone);

//     const response = await fetch("https://control.msg91.com/api/v5/flow/", {
//       method: "POST",
//       headers: {
//         "authkey": process.env.MSG91_AUTH_KEY,
//         "content-type": "application/json",
//       },
//       body: JSON.stringify({
//         flow_id: process.env.MSG91_TEMPLATE_ID,
//         sender: process.env.MSG91_SENDER_ID,
//         mobiles: mobile,  // ✅ fixed here
//         venue: smsData.venue,
//         date: smsData.date,
//         time: smsData.time,
//         time2: smsData.time2,
//         amount: smsData.amount,
//       }),
//     });

//     const result = await response.json();
//     console.log("📩 SMS Sent Response:", result);
//     return result;
//   } catch (err) {
//     console.error("❌ SMS sending failed:", err);
//     return null;
//   }
// };
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// ✅ Clean and normalize phone numbers
const formatMobile = (phone) => {
  if (!phone) return null; // avoid crash if missing
  let clean = phone.replace(/\D/g, ""); // remove all non-digits
  if (clean.startsWith("91")) {
    return clean; // already has country code
  }
  return `91${clean}`; // add if missing
};

// ✅ Booking Confirmation SMS
export const sendBookingConfirmationSMS = async (phone, smsData) => {
  try {
    const mobile = formatMobile(phone);
    if (!mobile) throw new Error("Invalid phone number");

    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        flow_id: process.env.MSG91_TEMPLATE_ID,   // ⚠️ Confirmation template ID
        sender: process.env.MSG91_SENDER_ID,
        mobiles: mobile,
        venue: smsData.venue,
        date: smsData.date,
        time: smsData.time,
        time2: smsData.time2,
        amount: smsData.amount,
      }),
    });

    const result = await response.json();
    console.log("📩 Confirmation SMS Sent Response:", result);
    return result;
  } catch (err) {
    console.error("❌ Confirmation SMS failed:", err.message || err);
    return null;
  }
};

// ✅ Booking Cancellation SMS
export const sendBookingCancelledSMS = async (phone, smsData) => {
  try {
    const mobile = formatMobile(phone);
    if (!mobile) throw new Error("Invalid phone number");

    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
     body: JSON.stringify({
  flow_id: process.env.MSG91_CANCEL_TEMPLATE_ID,
  sender: process.env.MSG91_SENDER_ID,
  mobiles: mobile,
  venue: smsData.venue,
  date: smsData.date,
  time: smsData.time,
  time1: smsData.time1,   // ✅ fixed
  amount: smsData.amount,
}),

    });

    const result = await response.json();
    console.log("📩 Cancellation SMS Sent Response:", result);
    return result;
  } catch (err) {
    console.error("❌ Cancellation SMS failed:", err.message || err);
    return null;
  }
};
