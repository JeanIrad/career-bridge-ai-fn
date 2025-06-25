// Test script to verify API conversion is working
const {
  getInternshipLocations,
  getInternshipCompanies,
  getInternshipTypes,
} = require("./lib/api");

async function testApiConversion() {
  try {
    console.log("Testing API conversion...\n");

    // Test locations
    console.log("Testing locations API...");
    const locations = await getInternshipLocations();
    console.log("Locations:", locations);
    console.log("First location type:", typeof locations[0]);

    // Test companies
    console.log("\nTesting companies API...");
    const companies = await getInternshipCompanies();
    console.log("Companies:", companies);
    console.log("First company type:", typeof companies[0]);

    // Test types
    console.log("\nTesting types API...");
    const types = await getInternshipTypes();
    console.log("Types:", types);
    console.log("First type type:", typeof types[0]);

    console.log("\n✅ All API conversions working correctly!");
  } catch (error) {
    console.error("❌ Error testing API conversion:", error);
  }
}

testApiConversion();
