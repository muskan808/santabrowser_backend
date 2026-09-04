/**
 * @openapi
 * /auth/register:
 *   post:
 *     security: []
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, required: [name,email,password], properties: { name: {type: string}, email: {type: string}, password: {type: string} } }
 *     responses: { '201': { description: Created }, '409': { description: Conflict } }
 * /auth/login:
 *   post:
 *     security: []
 *     summary: Login and set JWT HTTP-only cookie
 *     responses: { '200': { description: OK }, '401': { description: Unauthorized } }
 * /auth/me:
 *   get:
 *     summary: Current authenticated user
 *     responses: { '200': { description: OK } }
 * /auth/logout:
 *   post:
 *     summary: Clear authentication cookie
 *     responses: { '200': { description: OK } }
 * /files/upload:
 *   post:
 *     summary: Upload image, video, audio or PDF
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { type: object, required: [file], properties: { file: { type: string, format: binary }, tags: { type: string, example: "travel,summer" } } }
 *     responses: { '201': { description: Created }, '400': { description: Invalid upload } }
 * /files/search:
 *   get:
 *     summary: Search and rank files
 *     parameters:
 *       - { in: query, name: query, schema: {type: string} }
 *       - { in: query, name: type, schema: {type: string, enum: [image,video,audio,raw]} }
 *       - { in: query, name: tag, schema: {type: string} }
 *       - { in: query, name: from, schema: {type: string, format: date-time} }
 *       - { in: query, name: to, schema: {type: string, format: date-time} }
 *     responses: { '200': { description: Ranked results } }
 * /files/{id}:
 *   get:
 *     summary: Get a file and increment its view count
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses: { '200': { description: OK }, '404': { description: Not found } }
 *   delete:
 *     summary: Delete a file
 *     parameters: [{in: path, name: id, required: true, schema: {type: string}}]
 *     responses: { '200': { description: Deleted } }
 * /files:
 *   get:
 *     summary: List uploaded files
 *     responses: { '200': { description: OK } }
 */
