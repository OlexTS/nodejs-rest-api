const fs = require('fs').promises;
const path = require('path');
const {nanoid} = require('nanoid');


const contactsPath = path.join(__dirname, 'contacts.json');


const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

const getById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.contactId === contactId);
  return contact || null;

}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const newContacts = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContacts
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = { id: nanoid(21), ...body };
  contacts.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contact;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index]
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
