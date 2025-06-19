## Identity Reconciliation

This repository tackles an identity reconciliation problem for an e-commerce platform. Our goal is to identify and link customer purchases even when they use different contact information.

We store contact details in a relational database table named `Contact`. A customer can have multiple `Contact` rows linked together, with the oldest being the "primary" and the rest "secondary".

**Hosted Version:** The web service is available at

```
https://identity-reconciliation-2z7o.onrender.com/identify
```

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Database configuration:**

   - Configure your database connection details in `.env` file.
   - Run migrations using `npm run migrate`.

3. **Start the server:**
   ```bash
   npm start
   ```

### API Endpoint

The web service offers an endpoint `/identify` that accepts POST requests to identify a customer:

```json
{
  "email": string? (optional),
  "phoneNumber": number? (optional)
}
```

The response is a JSON object with the following structure:

```json
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

**Example:**

Request:

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

Response:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

### How it Works

- The service searches for existing contacts matching the provided `email` or `phoneNumber`.
- If a match is found, it returns the consolidated contact details, including emails, phone numbers, and secondary contact IDs.
- If no match is found, a new "primary" contact is created.

**Secondary Contacts:**

- A secondary contact is created when new information (different email or phone number) is linked to an existing contact.

**Primary Contact Demotion:**

- A primary contact can become secondary if a newer contact with matching details is found.

**Tech Stack:**

- Database: PostgreSQL
- Backend: Node.js with TypeScript


##  Author

**Sharanya Singhal**  
GitHub: [sharanya2005singhal@gmail.com](https://github.com/sharanyasinghal)
