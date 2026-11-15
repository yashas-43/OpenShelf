import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const source = (rel) => readFileSync(resolve(root, rel), 'utf8');

// Source-level guard tests. Live HTTP/MongoDB integration remains to be tested on Windows.
test('payment routes, including webhook, are disabled in the running Express app', () => {
  const app = source('server/src/app.js');
  assert.match(app, /app\.use\('\/api\/payments', \(_req, res\) => res\.status\(410\)/);
  assert.match(app, /PAYMENTS_DISABLED/);
  assert.doesNotMatch(app, /import paymentRoutes from/);
  assert.doesNotMatch(app, /app\.post\('\/api\/payments\/webhook'/);
});

test('Student PDF access and progress are no longer paywalled', () => {
  const server = source('server/src/controllers/studentPdfController.js');
  const ui = source('client/src/pages/StudentLibrary.jsx');
  assert.doesNotMatch(server, /hasSubjectAccess|SUBJECT_PURCHASE_REQUIRED|status\(402\)/);
  assert.match(server, /activePdf\(req\.params\.id\)/);
  assert.match(server, /inspectStoredPdfFile\(textbookRoot\(\), result\.pdf\)/);
  assert.match(ui, /FREE STUDENT TEXTBOOK/);
  assert.doesNotMatch(ui, /checkoutSubject|\/api\/payments|Unlock subject|Purchase once/);
});

test('dashboards hide payment features and historic models are preserved', () => {
  const studentDashboard = source('client/src/pages/UserDashboard.jsx');
  const adminDashboard = source('client/src/pages/AdminDashboard.jsx');
  assert.doesNotMatch(studentDashboard, /\/api\/payments/);
  assert.doesNotMatch(adminDashboard, /\/api\/payments/);
  assert.match(source('server/src/models/Payment.js'), /mongoose/);
  assert.match(source('server/src/models/Purchase.js'), /mongoose/);
});
