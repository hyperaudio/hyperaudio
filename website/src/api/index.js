import axios from 'axios';

import { generateId, computeId } from './utils';
import { getItem, setItem, setItemVersioned } from './db';
import { User } from './models';

const SERVER = typeof window === 'undefined';

export const wash = obj => JSON.parse(JSON.stringify(obj));

// TODO
// export const createUser;

export const getUser = async (id, consistentRead) =>
  SERVER
    ? new User((await getItem(`user:${id}`, `v0_user:${id}`, consistentRead))?.Item)
    : new User((await axios.get(`/api/v2/users/${id}`))?.data);

export const setUser = async (user, currentUser) =>
  SERVER
    ? (await setItemVersioned(user.pk, user.sk, user, currentUser.id)) && (await getUser(user.id, true))
    : new User((await axios.put(`/api/v2/users/${user.id}`, user))?.data);

// TODO
// export const createChannel;

export const getChannel = async (id, consistentRead) =>
  SERVER
    ? new User((await getItem(`channel:${id}`, `v0_channel:${id}`, consistentRead))?.Item)
    : new User((await axios.get(`/api/v2/channels/${id}`))?.data);
