const fs = require("fs");

// Load JSON data from a file
const jsonData = require("./apitemplate.json");

// Recursive function to filter out entries containing 'Demo.inc' case-insensitively
function filterEntries(obj) {
	if (Array.isArray(obj)) {
		return obj
			.map((item) => filterEntries(item))
			.filter((item) => item !== null);
	} else if (obj !== null && typeof obj === "object") {
		const newObj = {};
		let hasMatch = false; // Flag to check if any sub-properties match
		for (const key in obj) {
			const value = obj[key];
			if (typeof value === "object" || Array.isArray(value)) {
				const result = filterEntries(value);
				if (result !== null) {
					newObj[key] = result;
					hasMatch = true;
				}
			} else if (
				typeof value === "string" &&
				value.toLowerCase().includes("/10000")
			) {
				newObj[key] = value;
				hasMatch = true;
			}
		}
		return hasMatch ? newObj : null;
	} else {
		return null;
	}
}

// Filter the data and write to a new file
const filteredData = filterEntries(jsonData);
if (filteredData) {
	fs.writeFile("output.json", JSON.stringify(filteredData, null, 2), (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return;
		}
		console.log("Filtered data has been written to output.json");
	});
} else {
	console.log('No data containing "/10000" found.');
}
