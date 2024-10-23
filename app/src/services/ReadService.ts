import { Injectable } from '@angular/core';
import { TagRead } from "../models/TagRead";
import { DeviceInfoService } from "./DeviceInfoService";
import { AuthService } from "./AuthService";
import {Observable, of, from} from 'rxjs';
import {Router} from "@angular/router";
import { openDB, DBSchema, IDBPDatabase } from 'idb';


interface ScansDB extends DBSchema {
  'sync-scans': {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
    };
  };
}


@Injectable({
  providedIn: 'root'
})
export class ReadService {
  private dbPromise: Promise<IDBPDatabase<ScansDB>>;

  constructor(
    private deviceInfoService: DeviceInfoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<ScansDB>> {
    return await openDB<ScansDB>('sync-db', 1, {
      upgrade(db: IDBPDatabase<ScansDB>) {
        db.createObjectStore('sync-scans', { keyPath: 'id' });
      },
    });
  }


  saveReadTag(identifier: string): Observable<any> {
    const deviceInfo = this.deviceInfoService.getDeviceInfo();
    const organization = this.authService.getOrganization();
    const patrollerIdentifier = this.authService.getPatrollerIdentifier()

    if (!organization || !patrollerIdentifier) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const newTagRead = new TagRead(
      identifier,
      new Date(),
      organization.id,
      patrollerIdentifier,
      deviceInfo
    );

    return from(this.scheduleSync(newTagRead));
  }

  private async scheduleSync(tag: TagRead): Promise<any> {
    await this.saveTagForSync(tag);
    const sw = await navigator.serviceWorker.ready;
    await (sw as any).sync.register('sync-scans');
    return { message: 'Tag programado para sincronización' };
  }

  private async saveTagForSync(tag: TagRead): Promise<void> {
    const db = await this.dbPromise;
    await db.add('sync-scans', {
      id: tag.id,
      data: tag,
      timestamp: Date.now()
    });
  }

  async getTagsToSync(): Promise<any[]> {
    const db = await this.dbPromise;
    return await db.getAll('sync-scans');
  }

  async removeTagFromSync(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('sync-scans', id);
  }

}
