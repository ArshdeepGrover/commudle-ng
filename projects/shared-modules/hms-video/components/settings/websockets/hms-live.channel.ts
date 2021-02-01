import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as actionCable from 'actioncable';
import { APPLICATION_CABLE_CHANNELS } from 'projects/shared-services/application-cable-channels.constants';
import { ActionCableConnectionSocket } from 'projects/shared-services/action-cable-connection.socket';
import { LibAuthwatchService } from 'projects/shared-services/lib-authwatch.service';


@Injectable({
  providedIn: 'root'
})
export class HmsLiveChannel {
  ACTIONS = {
    SET_PERMISSIONS: 'set_permissions',
    UPDATE_USER: 'update_user',
    INVITE_GUEST: 'invite_guest',
    REMOVE_GUEST: 'remove_guest',
    FORCE_MUTE_MIC: 'force_mute_mic',
    FORCE_MUTE_CAMERA: 'force_mute_camera'
}

  actionCable = actionCable;
  private cableConnection;

  private subscriptions = {};

  // all the communications received will be observables
  private channelsList: BehaviorSubject<any> = new BehaviorSubject(new Set());
  public channelsList$ = this.channelsList.asObservable();

  private channelData = {};
  public channelData$ = {};

    // connection statuses of each channel
    private channelConnectionStatus = {};
    public channelConnectionStatus$ = {};

  constructor(
    private actionCableConnection: ActionCableConnectionSocket,
    private authWatchService: LibAuthwatchService
  ) {
    this.actionCableConnection.acSocket$.subscribe(
      connection => {
        this.cableConnection = connection;
      }
    )
  }



  subscribe(hmsRoomId, hmsClientUid, name, role, mic, camera) {
    if (this.cableConnection) {
      this.channelData[`${hmsClientUid}`] = new BehaviorSubject(null);
      this.channelData$[`${hmsClientUid}`] = this.channelData[`${hmsClientUid}`].asObservable();
      this.channelsList.next(this.channelsList.getValue().add(`${hmsClientUid}`));

      this.subscriptions[`${hmsClientUid}`] = this.cableConnection.subscriptions.create({
        channel: APPLICATION_CABLE_CHANNELS.HMS_LIVE_CHANNEL,
        hms_room_id: hmsRoomId,
        hms_client_uid: hmsClientUid,
        name,
        role,
        mic,
        camera,
        app_token: this.authWatchService.getAppToken()

      }, {
        connected: () => {
          this.channelConnectionStatus[`${hmsClientUid}`].next(true);
        },
        received: (data) => {
          this.channelData[`${hmsClientUid}`].next(data);
        },
        disconnected: () => {
          this.channelConnectionStatus[`${hmsClientUid}`].next(false);
        }
      });
    }

    return this.subscriptions[`${hmsClientUid}`];

  }


  sendData(action, hmsClientUid, data) {
    this.subscriptions[`${hmsClientUid}`].send({
      perform: action,
      data
    });
  }



  unsubscribe(hmsClientUid) {
    if (this.subscriptions[`${hmsClientUid}`]) {
      this.subscriptions[`${hmsClientUid}`].unsubscribe();
    }
  }

}
