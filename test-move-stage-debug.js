// Test script to debug the move stage button functionality
console.log("🚀 Starting Move Stage Debug Test");

// Test 1: Check if we can access the API
async function testAPI() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log("✅ User authenticated:", user);
      return user;
    } else {
      console.log("❌ Authentication failed");
      return null;
    }
  } catch (error) {
    console.log("❌ API connection failed:", error);
    return null;
  }
}

// Test 2: Check if user has jobs
async function testJobs() {
  try {
    const response = await fetch("http://localhost:5000/api/jobs/my-jobs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const jobs = await response.json();
      console.log("✅ User jobs:", jobs);
      return jobs;
    } else {
      console.log("❌ Failed to fetch jobs");
      return null;
    }
  } catch (error) {
    console.log("❌ Jobs API failed:", error);
    return null;
  }
}

// Test 3: Check if jobs have applications
async function testApplications(jobId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/jobs/${jobId}/applications`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      const applications = await response.json();
      console.log("✅ Job applications:", applications);
      return applications;
    } else {
      console.log("❌ Failed to fetch applications");
      return null;
    }
  } catch (error) {
    console.log("❌ Applications API failed:", error);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log("=== Running Debug Tests ===");

  const user = await testAPI();
  if (!user) {
    console.log("🛑 Please login as an employer first");
    return;
  }

  if (user.role !== "EMPLOYER") {
    console.log(
      "🛑 Please login as an EMPLOYER (current role:",
      user.role,
      ")"
    );
    return;
  }

  const jobs = await testJobs();
  if (!jobs || jobs.data.length === 0) {
    console.log("🛑 No jobs found. Please create a job first");
    return;
  }

  console.log("📋 Found", jobs.data.length, "jobs");

  for (const job of jobs.data) {
    console.log("🔍 Checking applications for job:", job.title);
    const applications = await testApplications(job.id);

    if (applications && applications.data.length > 0) {
      console.log(
        "✅ Found",
        applications.data.length,
        "applications for job:",
        job.title
      );
      console.log(
        "📊 Application statuses:",
        applications.data.map((app) => app.status)
      );

      // Test the move stage API
      const testApp = applications.data[0];
      console.log("🎯 Testing move stage for application:", testApp.id);
      console.log("Current status:", testApp.status);

      return { job, applications: applications.data };
    }
  }

  console.log("🛑 No applications found on any jobs");
}

// Run the test
runTests();
