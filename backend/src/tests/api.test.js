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

    // 5b. Create another Lead for Sorting
    const createLead2Res = await fetch(`${baseUrl}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Amit Patel', phone: '9876543211', status: 'Contacted' })
    });
    const createLead2 = await createLead2Res.json();
    assert.strictEqual(createLead2Res.status, 201);
    const lead2Id = createLead2.data._id;
    console.log('✔ Test Create Second Lead passed');

    // 5c. Test Create Lead (Duplicate Phone - Failure)
    const createLeadDupRes = await fetch(`${baseUrl}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Rahul Duplicate', phone: '9876543210', status: 'New' })
    });
    const createLeadDup = await createLeadDupRes.json();
    assert.strictEqual(createLeadDupRes.status, 400);
    assert.strictEqual(createLeadDup.success, false);
    assert.strictEqual(createLeadDup.message, 'Validation failed');
    assert.ok(Array.isArray(createLeadDup.errors));
    assert.strictEqual(createLeadDup.errors[0].field, 'phone');
    assert.strictEqual(createLeadDup.errors[0].message, 'A lead with this phone number already exists');
    console.log('✔ Test Create Lead (Duplicate Phone) Failure passed');

    // 6. Test Get Leads List & Search/Filter
    const getLeadsRes = await fetch(`${baseUrl}/leads?q=rahul`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getLeads = await getLeadsRes.json();
    assert.strictEqual(getLeadsRes.status, 200);
    assert.strictEqual(getLeads.success, true);
    assert.strictEqual(getLeads.data.leads.length, 1);
    assert.strictEqual(getLeads.data.stats.New, 1);
    assert.strictEqual(getLeads.data.stats.Contacted, 1);
    assert.strictEqual(getLeads.data.stats.total, 2);
    console.log('✔ Test Get Leads with Search passed');

    // 6b. Test Sorting (Name A-Z)
    const sortAZRes = await fetch(`${baseUrl}/leads?sortBy=name&sortOrder=asc`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sortAZ = await sortAZRes.json();
    assert.strictEqual(sortAZ.data.leads[0].name, 'Amit Patel');
    assert.strictEqual(sortAZ.data.leads[1].name, 'Rahul Sharma');
    console.log('✔ Test Sort Name (A-Z) passed');

    // 6c. Test Sorting (Name Z-A)
    const sortZARes = await fetch(`${baseUrl}/leads?sortBy=name&sortOrder=desc`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sortZA = await sortZARes.json();
    assert.strictEqual(sortZA.data.leads[0].name, 'Rahul Sharma');
    assert.strictEqual(sortZA.data.leads[1].name, 'Amit Patel');
    console.log('✔ Test Sort Name (Z-A) passed');

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

    // 8b. Test Patch Lead (Duplicate Phone - Failure)
    const patchLeadDupRes = await fetch(`${baseUrl}/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone: '9876543211' })
    });
    const patchLeadDup = await patchLeadDupRes.json();
    assert.strictEqual(patchLeadDupRes.status, 400);
    assert.strictEqual(patchLeadDup.success, false);
    assert.strictEqual(patchLeadDup.errors[0].field, 'phone');
    assert.strictEqual(patchLeadDup.errors[0].message, 'A lead with this phone number already exists');
    console.log('✔ Test Patch Lead (Duplicate Phone) Failure passed');

    // 9. Test Delete Lead 1 (Success)
    const deleteLeadRes = await fetch(`${baseUrl}/leads/${leadId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deleteLead = await deleteLeadRes.json();
    assert.strictEqual(deleteLeadRes.status, 200);
    assert.strictEqual(deleteLead.success, true);

    // 9b. Test Delete Lead 2 (Success)
    const deleteLead2Res = await fetch(`${baseUrl}/leads/${lead2Id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deleteLead2 = await deleteLead2Res.json();
    assert.strictEqual(deleteLead2Res.status, 200);
    assert.strictEqual(deleteLead2.success, true);
    console.log('✔ Test Delete Both Leads passed');

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
