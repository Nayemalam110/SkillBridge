/**
 * Frontend API Integration Test Script
 * 
 * Run this in the browser console to test the API integration
 * Make sure to set the testEmail and testPassword from your test credentials
 */

// Test Configuration
const testEmail = 'john@example.com';
const testPassword = 'Seeker123!';
let testToken = null;
let testUserId = null;

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (testToken) {
        headers['Authorization'] = `Bearer ${testToken}`;
    }

    const options = {
        method,
        headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`http://localhost:3000/api/v1${endpoint}`, options);
    return {
        status: response.status,
        data: await response.json(),
    };
}

// Test 1: Login
async function testLogin() {
    console.log('🔐 Test 1: Login');
    const result = await apiCall('POST', '/auth/login', {
        email: testEmail,
        password: testPassword,
    });

    if (result.status === 200) {
        // Handle both token formats
        if (result.data.data.tokens) {
            testToken = result.data.data.tokens.access;
        } else {
            testToken = result.data.data.accessToken;
        }
        testUserId = result.data.data.user.id;
        console.log('✅ Login successful');
        console.log(`   User: ${result.data.data.user.name} (${result.data.data.user.role})`);
        console.log(`   Token: ${testToken.substring(0, 20)}...`);
        return true;
    } else {
        console.error('❌ Login failed:', result.data.message);
        return false;
    }
}

// Test 2: Get Current User
async function testGetCurrentUser() {
    console.log('\n👤 Test 2: Get Current User');
    const result = await apiCall('GET', '/auth/me');

    if (result.status === 200) {
        console.log('✅ Get current user successful');
        console.log(`   Email: ${result.data.data.email}`);
        console.log(`   Role: ${result.data.data.role}`);
        return true;
    } else {
        console.error('❌ Get current user failed:', result.data.message);
        return false;
    }
}

// Test 3: List Jobs
async function testListJobs() {
    console.log('\n📋 Test 3: List Jobs');
    const result = await apiCall('GET', '/jobs');

    if (result.status === 200) {
        console.log('✅ List jobs successful');
        console.log(`   Total jobs: ${result.data.data.length}`);
        result.data.data.slice(0, 2).forEach((job) => {
            console.log(`   - ${job.title}`);
        });
        return true;
    } else {
        console.error('❌ List jobs failed:', result.data.message);
        return false;
    }
}

// Test 4: List Stacks
async function testListStacks() {
    console.log('\n🏗️  Test 4: List Stacks');
    const result = await apiCall('GET', '/stacks');

    if (result.status === 200) {
        console.log('✅ List stacks successful');
        console.log(`   Total stacks: ${result.data.data.length}`);
        result.data.data.slice(0, 2).forEach((stack) => {
            console.log(`   - ${stack.name}`);
        });
        return true;
    } else {
        console.error('❌ List stacks failed:', result.data.message);
        return false;
    }
}

// Test 5: Get Single Job
async function testGetJob() {
    console.log('\n📄 Test 5: Get Single Job');
    // First get a job ID
    const jobsResult = await apiCall('GET', '/jobs');
    if (jobsResult.status !== 200 || jobsResult.data.data.length === 0) {
        console.error('❌ No jobs available to test');
        return false;
    }

    const jobId = jobsResult.data.data[0].id;
    const result = await apiCall('GET', `/jobs/${jobId}`);

    if (result.status === 200) {
        console.log('✅ Get single job successful');
        console.log(`   Title: ${result.data.data.title}`);
        console.log(`   Location: ${result.data.data.location}`);
        console.log(`   Job Type: ${result.data.data.jobType}`);
        return true;
    } else {
        console.error('❌ Get single job failed:', result.data.message);
        return false;
    }
}

// Test 6: Get Profile
async function testGetProfile() {
    console.log('\n👥 Test 6: Get User Profile');
    const result = await apiCall('GET', '/users/profile');

    if (result.status === 200) {
        console.log('✅ Get profile successful');
        console.log(`   Name: ${result.data.data.name}`);
        console.log(`   Email: ${result.data.data.email}`);
        console.log(`   Skills: ${result.data.data.skills}`);
        return true;
    } else {
        console.error('❌ Get profile failed:', result.data.message);
        return false;
    }
}

// Test 7: List Applications
async function testListApplications() {
    console.log('\n📮 Test 7: List Applications');
    const result = await apiCall('GET', '/applications');

    if (result.status === 200) {
        console.log('✅ List applications successful');
        console.log(`   Total applications: ${result.data.data.length}`);
        result.data.data.slice(0, 2).forEach((app) => {
            console.log(`   - Job: ${app.job?.title}, Status: ${app.status}`);
        });
        return true;
    } else {
        console.error('❌ List applications failed:', result.data.message);
        return false;
    }
}

// Test 8: Get Dashboard
async function testGetDashboard() {
    console.log('\n📊 Test 8: Get Dashboard');
    const result = await apiCall('GET', '/dashboard/seeker');

    if (result.status === 200) {
        console.log('✅ Get dashboard successful');
        const stats = result.data.data.stats;
        console.log(`   Total Applications: ${stats.totalApplications}`);
        console.log(`   Accepted: ${stats.acceptedApplications}`);
        console.log(`   Rejected: ${stats.rejectedApplications}`);
        console.log(`   Pending: ${stats.pendingApplications}`);
        return true;
    } else {
        console.error('❌ Get dashboard failed:', result.data.message);
        return false;
    }
}

// Test 9: Logout
async function testLogout() {
    console.log('\n🚪 Test 9: Logout');
    const result = await apiCall('POST', '/auth/logout');

    if (result.status === 200) {
        console.log('✅ Logout successful');
        testToken = null;
        return true;
    } else {
        console.error('❌ Logout failed:', result.data.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting Frontend API Integration Tests\n');
    console.log('='.repeat(50));

    const tests = [
        testLogin,
        testGetCurrentUser,
        testListJobs,
        testListStacks,
        testGetJob,
        testGetProfile,
        testListApplications,
        testGetDashboard,
        testLogout,
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error(`❌ Test error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`\n📈 Test Results: ${passed} Passed, ${failed} Failed\n`);

    if (failed === 0) {
        console.log('✅ All tests passed! Frontend API integration is working correctly.');
    } else {
        console.log(`⚠️  ${failed} test(s) failed. Please check the errors above.`);
    }
}

// Export for use
window.skillBridgeTest = {
    runAllTests,
    testLogin,
    testGetCurrentUser,
    testListJobs,
    testListStacks,
    testGetJob,
    testGetProfile,
    testListApplications,
    testGetDashboard,
    testLogout,
};

console.log('📝 API Integration Tests Loaded!');
console.log('Run: window.skillBridgeTest.runAllTests() to start all tests');
console.log('Or run individual tests:');
console.log('  - window.skillBridgeTest.testLogin()');
console.log('  - window.skillBridgeTest.testListJobs()');
console.log('  - etc.');
