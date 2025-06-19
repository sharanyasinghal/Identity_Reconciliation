import { describe, test } from "@jest/globals";
import store from "../data/in-memory";
import { faker } from "@faker-js/faker";
import { contactInserter } from "./insert";

const insertContact = contactInserter(store);

describe("when email only contact is to be added", () => {
  test("no related contact exists, should add contact", async () => {
    await store.resetStore();
    const contact = {
      email: faker.internet.email(),
    };

    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe(contact.email);
  });

  test("a related email-only contact exists, should not add contact", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const contact = {
      email,
    };

    await insertContact(contact);
    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe(contact.email);
  });

  test("a related complete contact exists, should not add contact", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const contact = {
      email,
      phoneNumber,
    };

    await insertContact(contact);
    await insertContact({ email });

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe(contact.email);
    expect(contacts[0].phoneNumber).toBe(contact.phoneNumber);
  });
});

describe("when phone number only contact is to be added", () => {
  test("no related contact exists, should add contact", async () => {
    await store.resetStore();
    const contact = {
      phoneNumber: faker.phone.number(),
    };

    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].phoneNumber).toBe(contact.phoneNumber);
  });

  test("a related contact exists, should not add contact", async () => {
    await store.resetStore();
    const phoneNumber = faker.phone.number();
    const contact = {
      phoneNumber,
    };

    await insertContact(contact);
    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].phoneNumber).toBe(contact.phoneNumber);
  });

  test("a related complete contact exists, should not add contact", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const contact = {
      email,
      phoneNumber,
    };

    await insertContact(contact);
    await insertContact({ phoneNumber });

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe(contact.email);
    expect(contacts[0].phoneNumber).toBe(contact.phoneNumber);
  });
});

// complete contact means it has both email and phone number
describe("when complete contact is to be added", () => {
  test("no related contact exists, should add contact", async () => {
    await store.resetStore();
    const contact = {
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
    };

    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toBe(contact.email);
    expect(contacts[0].phoneNumber).toBe(contact.phoneNumber);
  });

  test("only related email-linked contact exists, should add contact with correct links", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const contact = {
      email,
      phoneNumber: faker.phone.number(),
    };

    await insertContact({ email });

    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(2);
    expect(contacts[1].email).toBe(contact.email);
    expect(contacts[1].phoneNumber).toBe(contact.phoneNumber);
    expect(contacts[1].linkedId).toBe(1);
  });

  test("only related phone-number-linked contact exists, should add contact", async () => {
    await store.resetStore();
    const phoneNumber = faker.phone.number();
    const contact = {
      email: faker.internet.email(),
      phoneNumber,
    };

    await insertContact({ phoneNumber });

    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(2);
    expect(contacts[1].email).toBe(contact.email);
    expect(contacts[1].phoneNumber).toBe(contact.phoneNumber);
    expect(contacts[1].linkedId).toBe(1);
  });

  // joint means they are already related
  test("joint related email and phone-number-linked contact exists, should not add contact", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const contact = {
      email,
      phoneNumber,
    };

    await insertContact({ email });
    await insertContact(contact);

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(2);

    await insertContact({ phoneNumber });

    const newContacts = await store.getAllContacts();
    expect(newContacts).toHaveLength(2);
  });

  // disjoint means they are not related yet
  test("disjoint related email and phone-number-linked contact exists, should merge contact", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const contact = {
      email,
      phoneNumber,
    };

    await insertContact({ email });
    await new Promise((resolve) => setTimeout(resolve, 200));
    await insertContact({ phoneNumber });

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(2);

    await insertContact(contact);

    const newContacts = await store.getAllContacts();
    expect(newContacts).toHaveLength(2);
    expect(newContacts[0].linkedId).toBeUndefined();
    expect(newContacts[1].linkedId).toBe(1);
  });

  test("disjoint related email and phone-number-linked contact exists, should merge contact even if chains exists and order is changed wrt email and password", async () => {
    await store.resetStore();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const contact = {
      email,
      phoneNumber,
    };

    await insertContact({ phoneNumber });
    await insertContact({ phoneNumber, email: faker.internet.email() });
    await new Promise((resolve) => setTimeout(resolve, 200));
    await insertContact({ email });
    await insertContact({ email, phoneNumber: faker.phone.number() });

    const contacts = await store.getAllContacts();
    expect(contacts).toHaveLength(4);

    await insertContact(contact);

    const newContacts = await store.getAllContacts();
    expect(newContacts).toHaveLength(4);
    expect(newContacts[0].linkedId).toBeUndefined();
    expect(newContacts[1].linkedId).toBe(1);
    expect(newContacts[2].linkedId).toBe(1);
    expect(newContacts[3].linkedId).toBe(1);
  });
});
