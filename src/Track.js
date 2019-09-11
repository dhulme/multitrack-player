let id = 0; // TODO improve ID mechanism

export default class Track {
  constructor({ buffer }) {
    this.buffer = buffer;
    this.active = false;
    this.name = 'New track';
    this.id = id++;
  }
}
