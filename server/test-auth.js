/**
 * Me Plus Authentication & Validation Test Suite
 * Run with: node server/test-auth.js
 */

const BASE = 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function runAuthTestSuite() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  ME PLUS AUTHENTICATION & VALIDATION TEST SUITE     ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ${colors.green}✔ PASS${colors.reset} - ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ${colors.red}✖ FAIL${colors.reset} - ${name}`);
      console.log(`    ${colors.yellow}Reason:${colors.reset} ${err.message}\n`);
      failed++;
    }
  }

  // --- Test 1: Unregistered User Login Rejection ---
  await test('Reject login for unregistered user email (Expects 401)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown_freelancer@test.com', password: 'password123' }),
    });
    if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
    const data = await res.json();
    if (!data.error || !data.error.includes('No account is registered')) {
      throw new Error(`Unexpected error message: ${data.error}`);
    }
  });

  // --- Test 2: Incorrect Password Rejection ---
  await test('Reject login with incorrect password for existing account (Expects 401)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.rivera@gmail.com', password: 'wrongPassword!@#' }),
    });
    if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
    const data = await res.json();
    if (!data.error || !data.error.includes('password you entered is incorrect')) {
      throw new Error(`Unexpected error message: ${data.error}`);
    }
  });

  // --- Test 3: Valid Credentials Login ---
  await test('Allow login with correct credentials (alex.rivera@gmail.com)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.rivera@gmail.com', password: 'password123' }),
    });
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.user || data.user.email !== 'alex.rivera@gmail.com') {
      throw new Error('User data missing or invalid in response');
    }
  });

  // --- Test 4: Duplicate Email Registration Prevention ---
  await test('Prevent duplicate account registration (Expects 409 Conflict)', async () => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Duplicate',
        email: 'alex.rivera@gmail.com',
        password: 'password123',
      }),
    });
    if (res.status !== 409) throw new Error(`Expected HTTP 409, got ${res.status}`);
    const data = await res.json();
    if (!data.error || !data.error.includes('already exists')) {
      throw new Error(`Unexpected error message: ${data.error}`);
    }
  });

  // --- Test 5: Register New User with Custom Profession ---
  const dynamicTestEmail = `freelancer_${Date.now()}@example.com`;
  await test('Register new user with custom profession ("3D Motion & VFX Designer")', async () => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: dynamicTestEmail,
        password: 'securePassword_2026',
        profession: '3D Motion & VFX Designer',
      }),
    });
    if (res.status !== 201) throw new Error(`Expected HTTP 201, got ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.title !== '3D Motion & VFX Designer') {
      throw new Error(`Custom profession was not saved correctly: ${data.user?.title}`);
    }
  });

  // --- Test 6: Forgot Password for Non-existent Email ---
  await test('Reject forgot password for unregistered email (Expects 404)', async () => {
    const res = await fetch(`${BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ghost_user@nonexistent.domain' }),
    });
    if (res.status !== 404) throw new Error(`Expected HTTP 404, got ${res.status}`);
    const data = await res.json();
    if (!data.error || !data.error.includes('No registered account')) {
      throw new Error(`Unexpected error message: ${data.error}`);
    }
  });

  // --- Test 7: Forgot Password Verification for Registered Account ---
  await test('Verify registered email in Step 1 of Forgot Password (Expects 200)', async () => {
    const res = await fetch(`${BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dynamicTestEmail }),
    });
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Failed to verify registered email');
  });

  // --- Test 8: Reset Password with New Password ---
  await test('Reset password to new value in Step 2 of Forgot Password (Expects 200)', async () => {
    const res = await fetch(`${BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dynamicTestEmail,
        newPassword: 'BrandNewUpdatedPassword2026!',
      }),
    });
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Password reset failed');
  });

  // --- Test 9: Login with Newly Reset Password ---
  await test('Immediate login with newly reset password (Expects 200)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dynamicTestEmail,
        password: 'BrandNewUpdatedPassword2026!',
      }),
    });
    if (res.status !== 200) throw new Error(`Expected HTTP 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.email !== dynamicTestEmail) {
      throw new Error('Login with new password failed');
    }
  });

  // --- Test 10: Old Password No Longer Works ---
  await test('Verify old password is invalidated after reset (Expects 401)', async () => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dynamicTestEmail,
        password: 'securePassword_2026', // Old password
      }),
    });
    if (res.status !== 401) throw new Error(`Expected HTTP 401, got ${res.status}`);
  });

  console.log(`\n${colors.bold}------------------------------------------------------${colors.reset}`);
  console.log(`  ${colors.bold}SUMMARY:${colors.reset} Total: ${passed + failed} | Passed: ${colors.green}${passed}${colors.reset} | Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`${colors.bold}------------------------------------------------------${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

