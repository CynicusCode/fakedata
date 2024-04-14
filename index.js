const { faker } = require("@faker-js/faker");
const originalData = require("./apitemplate.json");

function generateAPICall(id, startDate, endDate) {
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

	console.log(fakeAddress);

	apiCall.actualLocation.addrEntered = formattedAddress;
	apiCall.actualLocation.displayLabel = `Virtual Session (VRI)\\n${formattedAddress}`;
	apiCall.actualLocationDisplayLabel = `Virtual Session (VRI)\\n${formattedAddress}`;

	if (apiCall.location) {
		apiCall.location.addrEntered = formattedAddress;
		apiCall.location.displayLabel = `Virtual Session (VRI)\\n${formattedAddress}`;
	}

	apiCall.client.displayName = fakeCompanyName;
	apiCall.client.name = fakeCompanyName;
	apiCall.billingCustomer.displayName = fakeCompanyName;
	apiCall.billingCustomer.name = fakeCompanyName;
	apiCall.customer.displayName = fakeCompanyName;
	apiCall.customer.name = fakeCompanyName;

	for (let i = 0; i < apiCall.refs.length; i++) {
		apiCall.refs[i].customer.displayName = fakeCompanyName;
		apiCall.refs[i].customer.name = fakeCompanyName;
	}

	const expectedStartDate = faker.date.between(startDate, endDate);
	const expectedEndDate = faker.date.between(
		expectedStartDate,
		faker.date.future(0, expectedStartDate),
	);

	const durationOptions = [30, 60, 90, 120, 150, 180, 210, 240];
	const expectedDurationMins = faker.helpers.arrayElement(durationOptions);
	const expectedDurationHrs = expectedDurationMins / 60;

	apiCall.expectedStartDate = expectedStartDate.toISOString();
	apiCall.expectedStartTime = expectedStartDate.toISOString();
	apiCall.expectedEndDate = expectedEndDate.toISOString();
	apiCall.expectedDurationHrs = expectedDurationHrs;
	apiCall.expectedDurationMins = expectedDurationMins;

	return apiCall;
}

const numAPICalls = 1;
const startingId = 10001;
const startDate = new Date("2024-05-01T00:00:00Z");
const endDate = new Date("2024-05-31T23:59:59Z");
const generatedAPICalls = [];

for (let i = 0; i < numAPICalls; i++) {
	const id = startingId + i;
	const apiCall = generateAPICall(id, startDate, endDate);
	generatedAPICalls.push(apiCall);
}

console.log(JSON.stringify(generatedAPICalls, null, 2));
