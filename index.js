const { faker } = require("@faker-js/faker");
const originalData = require("./apitemplate.json");

function getRandomUSTimeZone() {
	const timeZones = [
		{ name: "America/New_York", displayName: "EDT" },
		{ name: "America/Chicago", displayName: "CDT" },
		{ name: "America/Denver", displayName: "MDT" },
		{ name: "America/Los_Angeles", displayName: "PDT" },
	];
	return faker.helpers.arrayElement(timeZones);
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

	apiCall.actualLocation.addrEntered = formattedAddress;
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

	return apiCall;
}

const numAPICalls = 20;
const startingId = 10001;
const generatedAPICalls = [];

for (let i = 0; i < numAPICalls; i++) {
	const id = startingId + i;
	generatedAPICalls.push(generateAPICall(id));
}

console.log(JSON.stringify(generatedAPICalls, null, 2));
