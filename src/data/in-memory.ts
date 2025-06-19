import { AddContact, Contact } from "../domain/contact";

let nextId: number = 1;
let contacts: Contact[] = [];

const resetStore = async () => {
  nextId = 1;
  contacts = [];
};

const getAllContacts = async () => {
  return [...contacts];
};

const addContact = async (contact: AddContact) => {
  contacts = [
    ...contacts,
    {
      ...contact,
      id: nextId++,
      createdAt: new Date(),
    },
  ];
};

const getContact = async (id: number) => {
  return contacts.find((contact) => contact.id === id) || null;
};

const getPrimaryViaEmail = async (email: string) => {
  const anyEmailLinked = contacts.find((contact) => contact.email === email);
  if (!anyEmailLinked) return null;
  if (anyEmailLinked.linkedId === undefined) return anyEmailLinked;
  return (
    contacts.find((contact) => contact.id === anyEmailLinked.linkedId) || null
  );
};

const getPrimaryViaPhoneNumber = async (phoneNumber: string) => {
  const anyPhoneLinked = contacts.find(
    (contact) => contact.phoneNumber === phoneNumber,
  );
  if (!anyPhoneLinked) return null;
  if (anyPhoneLinked.linkedId === undefined) return anyPhoneLinked;
  return (
    contacts.find((contact) => contact.id === anyPhoneLinked.linkedId) || null
  );
};

const mergePrimaries = async (primaryId: number, secondaryId: number) => {
  contacts = contacts.map((contact) => {
    if (contact.linkedId === secondaryId || contact.id === secondaryId) {
      return {
        ...contact,
        linkedId: primaryId,
      };
    }

    return contact;
  });
};

const getLinkedContacts = async ({
  email,
  phoneNumber,
}: {
  email?: string;
  phoneNumber?: string;
}) => {
  const anyLinked = contacts.find(
    (contact) => contact.email === email || contact.phoneNumber === phoneNumber,
  );
  if (!anyLinked) return [];
  const primaryId = anyLinked.linkedId || anyLinked.id;

  return [
    ...contacts.filter(
      (contact) => contact.linkedId === primaryId || contact.id === primaryId,
    ),
  ];
};

export default {
  resetStore,
  getAllContacts,
  addContact,
  getContact,
  mergePrimaries,
  getPrimaryViaEmail,
  getPrimaryViaPhoneNumber,
  getLinkedContacts,
};
