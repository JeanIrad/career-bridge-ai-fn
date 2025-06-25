// Test script to verify job application and saving integration
const API_BASE_URL = "http://localhost:5000/api";

// Mock authentication token for testing
const TEST_TOKEN = "test-token";

// Test job saving functionality
async function testSaveJob() {
  console.log("Testing job saving...");

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/test-job-id/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Save job response:", result);

    if (response.ok) {
      console.log("✅ Job saving endpoint is working");
    } else {
      console.log("❌ Job saving failed:", result.message);
    }
  } catch (error) {
    console.log("❌ Job saving error:", error.message);
  }
}

// Test job application functionality
async function testApplyToJob() {
  console.log("Testing job application...");

  try {
    const applicationData = {
      resumeUrl: "https://example.com/resume.pdf",
      coverLetter: "This is a test cover letter",
      additionalDocuments: [],
    };

    const response = await fetch(`${API_BASE_URL}/jobs/test-job-id/apply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    const result = await response.json();
    console.log("Apply to job response:", result);

    if (response.ok) {
      console.log("✅ Job application endpoint is working");
    } else {
      console.log("❌ Job application failed:", result.message);
    }
  } catch (error) {
    console.log("❌ Job application error:", error.message);
  }
}

// Test getting saved jobs
async function testGetSavedJobs() {
  console.log("Testing get saved jobs...");

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/saved`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    const result = await response.json();
    console.log("Get saved jobs response:", result);

    if (response.ok) {
      console.log("✅ Get saved jobs endpoint is working");
    } else {
      console.log("❌ Get saved jobs failed:", result.message);
    }
  } catch (error) {
    console.log("❌ Get saved jobs error:", error.message);
  }
}

// Test getting job statistics
async function testGetJobStats() {
  console.log("Testing get job stats...");

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    });

    const result = await response.json();
    console.log("Get job stats response:", result);

    if (response.ok) {
      console.log("✅ Get job stats endpoint is working");
    } else {
      console.log("❌ Get job stats failed:", result.message);
    }
  } catch (error) {
    console.log("❌ Get job stats error:", error.message);
  }
}

// Run all tests
async function runTests() {
  console.log("🧪 Starting job integration tests...\n");

  await testSaveJob();
  console.log("");

  await testApplyToJob();
  console.log("");

  await testGetSavedJobs();
  console.log("");

  await testGetJobStats();
  console.log("");

  console.log("🏁 Tests completed!");
}

// Run tests if this file is executed directly
if (typeof window === "undefined") {
  // Node.js environment
  const fetch = require("node-fetch");
  runTests();
} else {
  // Browser environment
  console.log("Run runTests() in the browser console to test the integration");
  window.runTests = runTests;
}
