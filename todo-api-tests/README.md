# Automated API Integration Tests

This directory contains automated integration tests for the Todo Application REST API endpoints.

## 📂 File Structure

* `Todo_App_API_Tests.postman_collection.json`: Postman Collection containing 9 automated test requests verifying all CRUD operations and error handling.
* `Todo_App_Local.postman_environment.json`: Postman Environment mapping `baseUrl` to `http://localhost` (pointing to the Dockerized frontend reverse proxy).
* `run-tests.sh`: Shell script to execute tests automatically using **Newman** (Command-line Runner for Postman).

---

## 🚀 Running Automated Tests (CLI)

Ensure that your Docker containers are currently up and running (`docker compose up -d` in the `todo-app` folder). Then, simply run the test script:

```bash
./run-tests.sh
```

This script will run `newman` on-the-fly via `npx` and execute the 9 requests, asserting:
- Correct HTTP status codes (200, 201, 204, 400, 404).
- Schema structure and response values matching what was created/updated.
- Dynamic data passing (saving the created Todo's ID to verify detail retrieval, updates, and deletion).

---

## 📬 Importing into Postman UI

1. Open the **Postman** desktop application.
2. Click the **Import** button in the top left or top navigation bar.
3. Drag & drop or select both files:
   - `Todo_App_API_Tests.postman_collection.json`
   - `Todo_App_Local.postman_environment.json`
4. Select **Todo App Local** as your active environment in the top right dropdown.
5. You can now run the requests manually one-by-one or click the three dots (`...`) next to **Todo App API Tests** collection -> click **Run collection** -> click **Run Todo App API Tests** to trigger the automated test runner inside the Postman GUI.
