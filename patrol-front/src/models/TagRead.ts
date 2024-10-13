import { v4 as uuidv4 } from "uuid";

import {DeviceInfo} from "./DeviceInfo";

export class TagRead{
  private id;
  private tag: string;
  private readAt: Date;
  private organizationId: string;
  private patrollerId: string;
  private deviceInfo: DeviceInfo;

  constructor(tag: string, readAt: Date, organizationId:string, patrollerId: string, deviceInfo: DeviceInfo){
    this.id = uuidv4();
    this.tag = tag;
    this.readAt = readAt;
    this.patrollerId = patrollerId;
    this.organizationId = organizationId;
    this.deviceInfo = deviceInfo;
  }
}
