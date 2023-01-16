import { v4 as uuidv4 } from 'uuid';
import storage from './user.storage.js';
import { IUser } from './user.interface.js';
import { assertIndexFound } from '../../assert/found.assert.js';
import { NOT_FOUND } from './user.message.js';
import cloneCleanModelByProperties from '../../handler/model.handler.js';
import {
  userPropertiesCreate,
  userPropertiesUpdate,
} from './user.properties.js';

const findExistingIndex = async (id: string): Promise<number> => {
  const data = await storage.getData();
  const index = data.findIndex((u) => u.id === id);

  assertIndexFound(index, NOT_FOUND);

  return index;
};

const findAll = async (): Promise<IUser[]> => {
  const users: IUser[] = await storage.getData();

  return users;
};

const findById = async (id: string): Promise<IUser | undefined> => {
  const data = await storage.getData();
  const user = data.find((u) => u.id === id);

  return user;
};

const create = async (user: IUser): Promise<IUser> => {
  const id = uuidv4();

  const cleanModel: IUser = cloneCleanModelByProperties(
    user,
    userPropertiesCreate
  );
  const createdUser: IUser = { ...cleanModel, id };
  await storage.push(createdUser);

  return createdUser;
};

const update = async (id: string, user: IUser): Promise<IUser> => {
  const index = await findExistingIndex(id);

  const cleanModel: IUser = cloneCleanModelByProperties(
    user,
    userPropertiesUpdate
  );
  await storage.updateByIndex({ ...cleanModel }, index);

  const data = await storage.getData();
  const updated: IUser = data[index];

  return updated;
};

const remove = async (id: string): Promise<boolean> => {
  const index = await findExistingIndex(id);
  const removed = await storage.removeByIndex(index);
  const isRemoved = removed.length > 0;

  return isRemoved;
};

export { findAll, findById, create, update, remove };
