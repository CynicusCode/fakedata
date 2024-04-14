const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const utcDate = "2024-04-05T21:30:00Z";
const easternTime = dayjs
	.utc(utcDate)
	.tz("America/New_York")
	.format("YYYY-MM-DDTHH:mm:ssZ");
console.log(easternTime);
