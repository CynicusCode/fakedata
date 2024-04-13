const { randAddress } = require('@ngneat/falso');
const originalData = require('./apitemplate.json');


function generateAPICall(id) {
  const apiCall = JSON.parse(JSON.stringify(originalData));
  
  apiCall.id = id;
  apiCall.uri = `https://osi.demo.com:443/api/booking/${id}`;
  
  const fakeAddress = randAddress();
  const formattedAddress = `${fakeAddress.street}, ${fakeAddress.city}, ${fakeAddress.county}, ${fakeAddress.zipCode}`;
  const fakeCompanyName = randCompanyName();

  apiCall.actualLocation.addrEntered = formattedAddress;
  apiCall.actualLocation.displayLabel = `Virtual Session (VRI)\\n${formattedAddress}`;
  apiCall.billingCustomer.displayName = fakeCompanyName;
  apiCall.billingCustomer.name = fakeCompanyName;

  return apiCall;
}

const numAPICalls = 1;
const startingId = 10001;

const generatedAPICalls = [];

for (let i = 0; i < numAPICalls; i++) {
  const id = startingId + i;
  const apiCall = generateAPICall(id);
  generatedAPICalls.push(apiCall);
}

console.log(JSON.stringify(generatedAPICalls, null, 2));