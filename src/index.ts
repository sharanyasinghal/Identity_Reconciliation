import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { contactInserter } from "./usecase/insert";
import * as store from "./data/postgres";
import { contactReader } from "./usecase/read";
import { removeDuplicatesInPlace, removeUndefinedAndNulls } from "./utils";

const insertContact = contactInserter(store);
const readContact = contactReader(store);

const port = process.env.PORT || "8000";

const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => {
  res.status(200).send();
});

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;
  // TODO: make validation more robust
  if (!email && !phoneNumber) {
    res.status(400).send("email or phoneNumber is required");
    return;
  }

  await insertContact({ email, phoneNumber });

  const contacts = await readContact({ email, phoneNumber });

  const result = {
    primaryContactId: contacts[0].id,
    emails: removeDuplicatesInPlace(
      removeUndefinedAndNulls(contacts.map((contact) => contact.email)),
    ),
    phoneNumbers: removeDuplicatesInPlace(
      removeUndefinedAndNulls(contacts.map((contact) => contact.phoneNumber)),
    ),
    secondaryContactIds: contacts.slice(1).map((contact) => contact.id),
  };

  res.status(200).send({
    contact: result,
  });
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
