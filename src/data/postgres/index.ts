import { AddContact, Contact } from "../../domain/contact";
import { db } from "./db";

export const addContact = async (contact: AddContact): Promise<void> => {
  await db
    .insertInto("contact")
    .values({
      ...contact,
      linkPrecedence: contact.linkedId ? "secondary" : "primary",
    })
    .executeTakeFirst();
};

export const mergePrimaries = async (
  primaryId: number,
  secondaryId: number,
): Promise<void> => {
  await db
    .updateTable("contact")
    .set({ linkedId: primaryId, linkPrecedence: "secondary" })
    .where((eb) => eb("linkedId", "=", secondaryId).or("id", "=", secondaryId))
    .execute();
};

export const getPrimaryViaEmail = async (
  email: string,
): Promise<Contact | null> => {
  const anyEmailLinked = await db
    .selectFrom("contact")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!anyEmailLinked) return null;

  if (!anyEmailLinked.linkedId) return anyEmailLinked;

  return db
    .selectFrom("contact")
    .selectAll()
    .where("id", "=", anyEmailLinked.linkedId)
    .executeTakeFirst()
    .then((contact) => contact || null);
};

export const getPrimaryViaPhoneNumber = async (
  phoneNumber: string,
): Promise<Contact | null> => {
  const anyPhoneLinked = await db
    .selectFrom("contact")
    .selectAll()
    .where("phoneNumber", "=", phoneNumber)
    .executeTakeFirst();

  if (!anyPhoneLinked) return null;

  if (!anyPhoneLinked.linkedId) return anyPhoneLinked;

  return db
    .selectFrom("contact")
    .selectAll()
    .where("id", "=", anyPhoneLinked.linkedId)
    .executeTakeFirst()
    .then((contact) => contact || null);
};

export const getLinkedContacts = async (contactLike: {
  email?: string;
  phoneNumber?: string;
}): Promise<Contact[]> => {
  const anyLinked = await db
    .selectFrom("contact")
    .selectAll()
    .where((eb) =>
      eb("email", "=", contactLike.email || "NO MATCH").or(
        "phoneNumber",
        "=",
        contactLike.phoneNumber || "NO MATCH",
      ),
    )
    .executeTakeFirst();

  if (!anyLinked) return [];
  const primaryId = anyLinked.linkedId || anyLinked.id;

  return db
    .selectFrom("contact")
    .selectAll()
    .where((eb) => eb("linkedId", "=", primaryId).or("id", "=", primaryId))
    .orderBy("createdAt asc")
    .execute();
};
