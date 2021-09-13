import axios from 'axios';

import { generateId, computeId } from './utils';
import { getItem, setItem, setItemVersioned } from './db/crud';
import User from './models/User';

const SERVER = typeof window === 'undefined';

export const wash = obj => JSON.parse(JSON.stringify(obj));

export const getUser = async (id, consistentRead) =>
  SERVER
    ? new User((await getItem(`user:${id}`, `v0_user:${id}`, consistentRead))?.Item)
    : new User((await axios.get(`/api/v2/users/${id}`))?.data);

export const setUser = async (user, currentUserId) =>
  SERVER
    ? (await setItemVersioned(user.pk, user.sk, user, currentUserId)) && (await getUser(user.id, true))
    : new User((await axios.put(`/api/v2/users/${user.id}`, user))?.data);

export const getChannel = async (id, consistentRead) =>
  SERVER
    ? new User((await getItem(`channel:${id}`, `v0_channel:${id}`, consistentRead))?.Item)
    : new User((await axios.get(`/api/v2/channels/${id}`))?.data); // TODO v2/channels

export const getMedia = async (id, consistentRead) =>
  SERVER
    ? new User((await getItem(`media:${id}`, `v0_media:${id}`, consistentRead))?.Item)
    : new User((await axios.get(`/api/v2/media/${id}`))?.data); // TODO v2/media
