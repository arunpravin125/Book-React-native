import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;

// CRON JOB EXPLANATION;
// Cron jobs are scheduled tasks that run periodically at fixed intervals
// we want to send 1 GET request for every 14 minutes

// how to define a "Schedule"
// you define a scheduled using a cron expression,which consists of 5 fields representing

//! minutes,HOUR,DAY OF THE MONTH,MONTH,DAY OF THE WEEL

//? EXAMPLES && EXPLANATION
//*  14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every MONTH
//* 0 0 1 1 * - At midnight, on january 1st
//* 0 * * * * - Every hour
