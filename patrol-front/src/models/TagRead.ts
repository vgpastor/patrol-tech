import { v4 as uuidv4 } from "uuid";

import {DeviceInfo} from "./DeviceInfo";

export class TagRead{
  private id;
  private tag: String;
  private readAt: Date;
  private userId: String;
  private deviceInfo: DeviceInfo;

  constructor(tag: String, readAt: Date, userId: String, deviceInfo: DeviceInfo){
    this.id = uuidv4();
    this.tag = tag;
    this.readAt = readAt;
    this.userId = userId;
    this.deviceInfo = deviceInfo;
  }
}
