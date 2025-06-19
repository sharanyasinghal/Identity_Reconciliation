import { AddContact, Contact } from "./contact";

export interface ContactStore {
  addContact(contact: AddContact): Promise<void>;
  mergePrimaries(primaryId: number, secondaryId: number): Promise<void>;
  getPrimaryViaEmail(email: string): Promise<Contact | null>;
  getPrimaryViaPhoneNumber(phoneNumber: string): Promise<Contact | null>;

  getLinkedContacts(contactLike: {
    email?: string;
    phoneNumber?: string;
  }): Promise<Contact[]>;
}
