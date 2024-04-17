const { faker } = require("@faker-js/faker");
const originalData = require("./apitemplate.json");
const dayjs = require("dayjs");
const fs = require("node:fs");
const path = require("node:path");

function replaceValues(refs) {
	for (const ref of refs) {
		if (ref.name === "3rd Party Video Link") {
			const generatedLink = generateLink();
			ref.ref = generatedLink;
			ref.referenceValue = generatedLink;
		}
	}
}

function getRandomUSTimeZone() {
	const timeZones = [
		{ name: "America/New_York", displayName: "EDT" },
		{ name: "America/Chicago", displayName: "CDT" },
		{ name: "America/Denver", displayName: "MDT" },
		{ name: "America/Los_Angeles", displayName: "PDT" },
	];
	return faker.helpers.arrayElement(timeZones);
}

function getRandomDuration() {
	const randomNumber = faker.number.int({ min: 1, max: 100 });
	let durationMins;

	if (randomNumber <= 10) {
		durationMins = 30; // 0.5 hours (30 minutes) - 10% chance
	} else if (randomNumber <= 35) {
		durationMins = 60; // 1 hour - 25% chance
	} else if (randomNumber <= 60) {
		durationMins = 90; // 1.5 hours - 25% chance
	} else if (randomNumber <= 75) {
		durationMins = 120; // 2 hours - 15% chance
	} else if (randomNumber <= 85) {
		durationMins = 150; // 2.5 hours - 10% chance
	} else if (randomNumber <= 90) {
		durationMins = 180; // 3 hours - 5% chance
	} else {
		durationMins = 240; // 4 hours - 10% chance
	}

	const durationHrs = durationMins / 60;

	return {
		durationMins,
		durationHrs,
	};
}

function generateLink() {
	const randomNumber = faker.number.int({ min: 1, max: 100 });
	if (randomNumber <= 40) {
		return "Demo generate link";
	}
	if (randomNumber <= 60) {
		return "Customer will provide link";
	}
	return "http://customer.generated.link";
}
function getRandomJobStatus() {
	const randomNumber = faker.number.int({ min: 1, max: 100 });
	if (randomNumber <= 20) return "Open";
	if (randomNumber <= 40) return "Offered";
	if (randomNumber <= 50) return "Assign";
	if (randomNumber <= 95) return "Confirm";
	return "Cancelled";
}

function generateAPICall(id) {
	const apiCall = JSON.parse(JSON.stringify(originalData));
	apiCall.id = id;
	apiCall.uri = `https://osi.demo.com:443/api/booking/${id}`;

	const fakeAddress = {
		street: faker.location.streetAddress(),
		city: faker.location.city(),
		state: faker.location.state(),
		zipCode: faker.location.zipCode(),
		country: "United States",
		countryCode: "US",
	};

	const formattedAddress = `${fakeAddress.street}, ${fakeAddress.city}, ${fakeAddress.state} ${fakeAddress.zipCode}`;
	const fakeCompanyName = faker.company.name();
	const { durationMins, durationHrs } = getRandomDuration();

	apiCall.actualLocation.addrEntered = formattedAddress;
	apiCall.location.addrEntered = formattedAddress;
	apiCall.billingLocation.addrEntered = formattedAddress;
	apiCall.billingLocation.displayLabel = formattedAddress;
	apiCall.actualLocation.displayLabel = `Virtual Session (VRI)\\n${formattedAddress}`;
	apiCall.client.displayName = fakeCompanyName;
	apiCall.client.name = fakeCompanyName;
	apiCall.notificationEmail = faker.internet.email();

	const requestorName = faker.person.fullName();
	const requestorPhone = faker.phone.number();
	apiCall.requestor.displayLabel = `${requestorName} ${requestorPhone}`;
	apiCall.requestor.displayName = `${requestorName} ${requestorPhone}`;
	apiCall.requestor.name = requestorName;

	apiCall.timeZone = getRandomUSTimeZone().name;
	apiCall.timeZoneDisplayName = getRandomUSTimeZone().displayName;

	// Generate a random job status and modify the name and nameKey fields
	const randomJobStatus = getRandomJobStatus();
	apiCall.visit.status.name = randomJobStatus;
	apiCall.visit.status.nameKey = randomJobStatus.toLowerCase();
	apiCall.expectedDurationMins = durationMins;
	apiCall.expectedDurationHrs = durationHrs;
	replaceValues(apiCall.refs);

	const startDate = faker.date.between({
		from: "2024-05-06T00:00:00.000Z",
		to: "2024-05-10T23:59:59.999Z",
	});
	// Set the time between 10 a.m. and 5 p.m.
	startDate.setUTCHours(faker.number.int({ min: 15, max: 22 }), 0, 0, 0);

	// Format the date in the desired format and time zone
	const formattedStartDate = startDate.toISOString().replace(".000Z", "Z");

	// Update the expectedStartDate in the apiCall object
	apiCall.expectedStartDate = formattedStartDate;
	apiCall.expectedStartTime = formattedStartDate;

	const expectedEndDate = dayjs(formattedStartDate).add(durationMins, "minute");
	apiCall.expectedEndDate = expectedEndDate.toISOString().replace(".000Z", "Z");

	return apiCall;
}

const numAPICalls = 2;
const startingId = 10001;
const generatedAPICalls = [];

const fakeDataDir = path.join(process.cwd(), "fakeData");
if (!fs.existsSync(fakeDataDir)) {
	fs.mkdirSync(fakeDataDir);
}

for (let i = 0; i < numAPICalls; i++) {
	const id = startingId + i;
	const apiCall = generateAPICall(id);

	// Write each job's data to a separate JSON file
	const jsonData = JSON.stringify(apiCall, null, 2);
	const fileName = `${id}.json`;
	const filePath = path.join(fakeDataDir, fileName);
	fs.writeFileSync(filePath, jsonData);

	console.log(`Generated data written to ${filePath}`);
}
