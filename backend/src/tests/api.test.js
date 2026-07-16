require('dotenv').config();
if (process.env.MONGODB_URI_TEST) {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
}
const assert = require('assert');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Lead = require('../models/lead.model');

const PORT = 5001; // Run tests on separate port

async function runTests() {
  console.log('--- STARTING BACKEND INTEGRATION TESTS ---');

  // Start Express server on test port
  const server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api/v1`;

  try {
    // Clear test collections
    await User.deleteMany({});
    await Lead.deleteMany({});
    
    // Seed test admin user
    const admin = new User({
      email: 'admin@fasterq.in',
      password: 'admin123'
    });
    await admin.save();
    console.log('Admin user seeded for testing.');

    // 1. Test Login (Failure - Wrong Password)
    const loginFailRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fasterq.in', password: 'wrong' })
    });
    const loginFail = await loginFailRes.json();
    assert.strictEqual(loginFailRes.status, 401);
    assert.strictEqual(loginFail.success, false);
    assert.strictEqual(loginFail.message, 'Invalid email or password');
    console.log('✔ Test Login Failure passed');

    // 2. Test Login (Success)
    const loginSuccessRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fasterq.in', password: 'admin123' })
    });
    const loginSuccess = await loginSuccessRes.json();
    assert.strictEqual(loginSuccessRes.status, 200);
    assert.strictEqual(loginSuccess.success, true);
    assert.ok(loginSuccess.data.token);
    const token = loginSuccess.data.token;
    console.log('✔ Test Login Success passed');

    // 3. Test Protected Route Access (Failure - No Token)
    const leadsNoTokenRes = await fetch(`${baseUrl}/leads`);
    const leadsNoToken = await leadsNoTokenRes.json();
    assert.strictEqual(leadsNoTokenRes.status, 401);
    assert.strictEqual(leadsNoToken.success, false);
    console.log('✔ Test Protected Route Access (No Token) passed');

    // 4. Test Create Lead (Validation Failure)
    const createLeadFailRes = await fetch(`${baseUrl}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'A', phone: '123', status: 'New' }) // Name too short, phone not 10 digits
    });
    const createLeadFail = await createLeadFailRes.json();
    assert.strictEqual(createLeadFailRes.status, 400);
    assert.strictEqual(createLeadFail.success, false);
    assert.strictEqual(createLeadFail.message, 'Validation failed');
    assert.ok(createLeadFail.errors.length > 0);
    console.log('✔ Test Create Lead Validation Failure passed');

    // 5. Test Create Lead (Success)
    const createLeadSuccessRes = await fetch(`${baseUrl}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Rahul Sharma', phone: '9876543210', status: 'New' })
    });
    const createLeadSuccess = await createLeadSuccessRes.json();
    assert.strictEqual(createLeadSuccessRes.status, 201);
    assert.strictEqual(createLeadSuccess.success, true);
    assert.strictEqual(createLeadSuccess.data.name, 'Rahul Sharma');
    assert.strictEqual(createLeadSuccess.data.phone, '9876543210');
    assert.strictEqual(createLeadSuccess.data.status, 'New');
    const leadId = createLeadSuccess.data._id;
    console.log('✔ Test Create Lead Success passed');

    // 6. Test Get Leads List & Search/Filter
    const getLeadsRes = await fetch(`${baseUrl}/leads?q=rahul`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getLeads = await getLeadsRes.json();
    assert.strictEqual(getLeadsRes.status, 200);
    assert.strictEqual(getLeads.success, true);
    assert.strictEqual(getLeads.data.leads.length, 1);
    assert.strictEqual(getLeads.data.stats.New, 1);
    assert.strictEqual(getLeads.data.stats.total, 1);
    console.log('✔ Test Get Leads with Search passed');

    // 7. Test Add Note (Success)
    const addNoteRes = await fetch(`${baseUrl}/leads/${leadId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: 'Spoke with client. Very interested in our services.' })
    });
    const addNote = await addNoteRes.json();
    assert.strictEqual(addNoteRes.status, 200);
    assert.strictEqual(addNote.success, true);
    assert.strictEqual(addNote.data.notes.length, 1);
    assert.strictEqual(addNote.data.notes[0].text, 'Spoke with client. Very interested in our services.');
    console.log('✔ Test Add Note passed');

    // 8. Test Patch Lead (Success)
    const patchLeadRes = await fetch(`${baseUrl}/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'Interested' })
    });
    const patchLead = await patchLeadRes.json();
    assert.strictEqual(patchLeadRes.status, 200);
    assert.strictEqual(patchLead.success, true);
    assert.strictEqual(patchLead.data.status, 'Interested');
    console.log('✔ Test Patch Lead passed');

    // 9. Test Delete Lead (Success)
    const deleteLeadRes = await fetch(`${baseUrl}/leads/${leadId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deleteLead = await deleteLeadRes.json();
    assert.strictEqual(deleteLeadRes.status, 200);
    assert.strictEqual(deleteLead.success, true);
    console.log('✔ Test Delete Lead passed');

    // 10. Verify empty state stats
    const getLeadsEmptyRes = await fetch(`${baseUrl}/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getLeadsEmpty = await getLeadsEmptyRes.json();
    assert.strictEqual(getLeadsEmpty.data.leads.length, 0);
    assert.strictEqual(getLeadsEmpty.data.stats.total, 0);
    console.log('✔ Test Verify Empty State passed');

    console.log('\n======================================');
    console.log('✔ ALL BACKEND INTEGRATION TESTS PASSED!');
    console.log('======================================');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    process.exit(1);
  } finally {
    server.close();
    mongoose.connection.close();
  }
}

// Connect mongoose first
mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/mini-leads-tracker-test')
  .then(runTests)
  .catch(err => {
    console.error('Failed to connect to database for tests', err);
    process.exit(1);
  });
