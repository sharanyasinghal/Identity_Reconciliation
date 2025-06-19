import { ContactStore } from "../domain/store";

type ContactLike = {
  email?: string;
  phoneNumber?: string;
};

export const contactInserter = (store: ContactStore) => {
  return async (contact: ContactLike) => {
    const emailLinkedContact = contact.email
      ? await store.getPrimaryViaEmail(contact.email)
      : null;

    const phoneNumberLinkedContact = contact.phoneNumber
      ? await store.getPrimaryViaPhoneNumber(contact.phoneNumber)
      : null;

    if (
      (contact.email && emailLinkedContact && !contact.phoneNumber) ||
      (contact.phoneNumber && phoneNumberLinkedContact && !contact.email)
    ) {
      // contact already exists
      return;
    }

    if (
      contact.email &&
      emailLinkedContact &&
      contact.phoneNumber &&
      phoneNumberLinkedContact
    ) {
      if (emailLinkedContact.id === phoneNumberLinkedContact.id) {
        // contact already exists
        return;
      }

      // merge case
      if (emailLinkedContact.createdAt < phoneNumberLinkedContact.createdAt) {
        await store.mergePrimaries(
          emailLinkedContact.id,
          phoneNumberLinkedContact.id,
        );
        return;
      }
      await store.mergePrimaries(
        phoneNumberLinkedContact.id,
        emailLinkedContact.id,
      );
      return;
    }

    await store.addContact({
      ...contact,
      linkedId: emailLinkedContact?.id || phoneNumberLinkedContact?.id,
    });
  };
};
