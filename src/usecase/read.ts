import { ContactStore } from "../domain/store";

export const contactReader = (store: ContactStore) => {
  return async (contact: { email?: string; phoneNumber?: string }) => {
    return store.getLinkedContacts(contact);
  };
};
