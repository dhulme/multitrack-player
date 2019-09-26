import { openDB } from 'idb';

const defaultCollection = 'default';
const dbConnection = openDB('multitrack-player', 1, {
  upgrade(db) {
    db.createObjectStore(defaultCollection);
  }
});

export async function set(key, value, collection = defaultCollection) {
  return (await dbConnection).put(collection, value, key);
}

export async function get(key, collection = defaultCollection) {
  return (await dbConnection).get(collection, key);
}
