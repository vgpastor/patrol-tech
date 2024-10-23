import { v4 as uuidv4 } from "uuid";

import {DeviceInfo} from "./DeviceInfo";

export class TagRead{
  public readonly id;
  public readonly tag: string;
  public readonly readAt: Date;
  public readonly organizationId: string;
  public readonly patrollerId: string;
  public readonly deviceInfo: DeviceInfo;

  constructor(tag: string, readAt: Date, organizationId:string, patrollerId: string, deviceInfo: DeviceInfo){
    this.id = uuidv4();
    this.tag = tag;
    this.readAt = readAt;
    this.patrollerId = patrollerId;
    this.organizationId = organizationId;
    this.deviceInfo = deviceInfo;
  }
}
