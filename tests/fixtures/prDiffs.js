// Mock PR diff responses for various scenarios

export const whitespaceOnlyDiff = `diff --git a/src/utils.js b/src/utils.js
index 1234567..abcdefg 100644
--- a/src/utils.js
+++ b/src/utils.js
@@ -1,10 +1,10 @@
 function calculateTotal(items) {
-  return items.reduce((sum, item) => {
-    return sum + item.price;
-  }, 0);
+    return items.reduce((sum, item) => {
+        return sum + item.price;
+    }, 0);
 }

 function formatCurrency(amount) {
-  return \`$\${amount.toFixed(2)}\`;
+    return \`$\${amount.toFixed(2)}\`;
 }`;

export const binaryFileDiff = `diff --git a/assets/logo.png b/assets/logo.png
new file mode 100644
index 0000000..1234567
Binary files /dev/null and b/assets/logo.png differ
diff --git a/assets/icon.svg b/assets/icon.svg
new file mode 100644
index 0000000..abcdefg
--- /dev/null
+++ b/assets/icon.svg
@@ -0,0 +1,5 @@
+<svg width="100" height="100">
+  <circle cx="50" cy="50" r="40" fill="blue" />
+</svg>
diff --git a/docs/screenshot.jpg b/docs/screenshot.jpg
new file mode 100644
index 0000000..7890abc
Binary files /dev/null and b/docs/screenshot.jpg differ`;

export const conflictDiff = `diff --git a/src/config.js b/src/config.js
index 1234567..abcdefg 100644
--- a/src/config.js
+++ b/src/config.js
@@ -1,7 +1,11 @@
 export const config = {
+<<<<<<< HEAD
+  apiUrl: 'https://api.production.com',
+  timeout: 5000,
+=======
   apiUrl: 'https://api.staging.com',
   timeout: 3000,
+>>>>>>> feature-branch
   retries: 3,
 };`;

export const emptyDiff = "";

export const largeDiff = `diff --git a/src/components/Dashboard.js b/src/components/Dashboard.js
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/components/Dashboard.js
@@ -0,0 +1,500 @@
+import React from 'react';
+import { Chart } from './Chart';
+import { Table } from './Table';
+
${"+ // ".repeat(500).split("+ //").join("+ // Line " + Math.random().toString(36) + "\n")}`;

export const singleLineDiff = `diff --git a/README.md b/README.md
index 1234567..abcdefg 100644
--- a/README.md
+++ b/README.md
@@ -1,1 +1,1 @@
-# My Project
+# My Awesome Project`;

export const multiFileDiff = `diff --git a/src/auth.js b/src/auth.js
index 1234567..abcdefg 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -1,5 +1,10 @@
 export function authenticate(token) {
-  return validateToken(token);
+  if (!token) {
+    throw new Error('Token is required');
+  }
+  const isValid = validateToken(token);
+  if (!isValid) {
+    throw new Error('Invalid token');
+  }
+  return true;
 }
diff --git a/src/middleware.js b/src/middleware.js
index 7890abc..def1234 100644
--- a/src/middleware.js
+++ b/src/middleware.js
@@ -1,3 +1,8 @@
+import { authenticate } from './auth.js';
+
 export function authMiddleware(req, res, next) {
-  // TODO: Implement authentication
-  next();
+  try {
+    authenticate(req.headers.authorization);
+    next();
+  } catch (error) {
+    res.status(401).json({ error: error.message });
+  }
 }
diff --git a/tests/auth.test.js b/tests/auth.test.js
new file mode 100644
index 0000000..5678901
--- /dev/null
+++ b/tests/auth.test.js
@@ -0,0 +1,15 @@
+import { authenticate } from '../src/auth.js';
+
+describe('authenticate', () => {
+  test('throws error when token is missing', () => {
+    expect(() => authenticate()).toThrow('Token is required');
+  });
+
+  test('throws error when token is invalid', () => {
+    expect(() => authenticate('invalid')).toThrow('Invalid token');
+  });
+
+  test('returns true for valid token', () => {
+    expect(authenticate('valid-token')).toBe(true);
+  });
+});`;

export const maliciousContentDiff = `diff --git a/src/dangerous.js b/src/dangerous.js
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/dangerous.js
@@ -0,0 +1,5 @@
+// Attempt to inject malicious content
+const payload = "<script>alert('XSS')</script>";
+const sql = "'; DROP TABLE users; --";
+const command = "rm -rf /";
+export { payload, sql, command };`;
