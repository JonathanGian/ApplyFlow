# Using the Postman Collection (ApplyFlow)

To setup postman for testing your endpoints you will need to do a few things inside of postman.

First you need to create a new collection for testing the endpoints

This guide explains how to import and use the **ApplyFlow Postman collection** stored in this repository.

---

## 1. Prerequisites

Before using the collection, make sure you have:

- Postman installed
- Your local ApplyFlow backend running:

```bash
npm run dev
```

- Your local Supabase CLI running:

```bash
supabase start
```

---

## 2. Import the Collection

1. Open Postman
2. Click **File → Import**
3. Select the collection JSON file located in:

```text
docs/Postman/
```

1. Confirm import — you should now see the `ApplyFlow` collection in Postman.

---

## 3. Create or Import the Environment

Create a new environment in Postman with the following variables:

| Variable Name               | Description                                                | Example Value                     |
|-----------------------------|------------------------------------------------------------|-----------------------------------|
| `SUPABASE_URL`              | Your Supabase project URL                                  | `http://127.0.0.1:54321`          |
| `SUPABASE_PUBLISHABLE_KEY`  | Supabase publishable/public API key                        | `sb_publishable_xxxxxxxxx`        |
| `email`                     | User email for login                                       | `alice@example.com`               |
| `password`                  | User password for login                                    | `password`                        |
| `access_token`              | Saved automatically after login                            | *(auto-populated)*                |
| `refresh_token`             | Saved automatically after login                            | *(auto-populated)*                |

After creating the environment, select it from the top-right dropdown in Postman.

---

## 4. Login Flow

Inside the collection, open:

```text
Auth → Login
```

This request:

- Authenticates against Supabase
- Stores `access_token` and `refresh_token` in the environment automatically

### Test Script (runs after login)

```js
const json = pm.response.json();
pm.environment.set("access_token", json.access_token);
pm.environment.set("refresh_token", json.refresh_token);
```

This saves the tokens returned by Supabase.

---

## 5. Automatic Authorization for Other Requests

The collection includes a pre-request script that runs before every request:

```js
const token = pm.environment.get("access_token");
if (token) {
  pm.request.headers.upsert({
    key: "Authorization",
    value: `Bearer ${token}`
  });
}
```

This automatically attaches:

```text
Authorization: Bearer {{access_token}}
```

So you do not need to manually copy/paste the token into every request.

---

## 6. Using Protected Endpoints

After running the Login request successfully, you can test protected endpoints such as:

```text
GET http://localhost:3000/api/applications
```

If authentication is valid, you should receive a `200 OK` response.

---

## 7. Pagination / Filtering Example

You can test flexible API parameters directly in the request URL:

```text
GET http://localhost:3000/api/applications?stage=Interested&sort=company&dir=asc&limit=10&offset=0
```

---

## 8. Troubleshooting

If you receive:

- `401 Unauthorized` → Re-run the Login request (token may be expired)
- Empty results → Verify seeded data exists
- Connection errors → Ensure backend and Supabase are running

---

## Summary

1. Import the collection
2. Create/select the environment
3. Run Login
4. Test endpoints

The access token will be managed automatically by Postman.
