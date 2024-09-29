import { TagRead } from './models/TagRead';
import {environment} from "./environments/environment";
export class ReadService {

  private tagsReads: TagRead[] | null = null;
  private sending = false;

  constructor() {
    this.getDataFromLocalStorage().then((data) => {
      this.tagsReads = data
      setInterval(() => {
        this.sentToServer();
        }, 3000);
    });
  }

  async saveData(data: TagRead) {
    console.log("saveData", data, this.tagsReads);
    if (this.tagsReads == null) {
      setTimeout(() => {
        this.saveData(data);
      }, 1000);
      return;
    }
    this.tagsReads.push(data);
    localStorage.setItem('tagReads', JSON.stringify(this.tagsReads));
  }

  async getDataFromLocalStorage(): Promise<TagRead[]> {
    var tagReadsString = localStorage.getItem('tagReads');
    if (tagReadsString) {
      return JSON.parse(tagReadsString);
    }
    return [];
  }

  async startSentToServer() {
    setInterval(() => {
      this.sentToServer();
    }, 3000);
  }

  async sentToServer() {
    if (this.tagsReads == null || this.tagsReads.length == 0) {
      this.sending = false;
      return;
    }
    this.sending = true;
    var firstSent = this.tagsReads[0];
    console.log("Sending to server", firstSent);
    // send to server
    fetch(environment.apiServer+'/api/scans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(firstSent),
    }).then((response) => {
      if (response.ok) {
        if (this.tagsReads == null) {
          return;
        }
        this.tagsReads.shift();
        localStorage.setItem('tagReads', JSON.stringify(this.tagsReads));
        if (this.tagsReads.length >= 0) {
          this.sentToServer();
        }
      }
    })
  }
}
