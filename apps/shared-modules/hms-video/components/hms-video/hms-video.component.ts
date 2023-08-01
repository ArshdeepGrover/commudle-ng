import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ICurrentUser } from 'apps/shared-models/current_user.model';
import { IEmbeddedVideoStream } from 'apps/shared-models/embedded_video_stream.model';
import { EHmsRoles } from 'apps/shared-modules/hms-video/enums/hms-roles.enum';
import { EHmsStates } from 'apps/shared-modules/hms-video/enums/hms-states.enum';
import { IHmsClient } from 'apps/shared-modules/hms-video/models/hms-client.model';
import { HmsApiService } from 'apps/shared-modules/hms-video/services/hms-api.service';
import { HmsVideoStateService } from 'apps/shared-modules/hms-video/services/hms-video-state.service';
import { HmsLiveChannel } from 'apps/shared-modules/hms-video/services/websockets/hms-live.channel';
import { LibAuthwatchService } from 'apps/shared-services/lib-authwatch.service';
import { Subscription } from 'rxjs';
import { HmsStageService } from '../../services/hms-stage.service';

@Component({
  selector: 'app-hms-video',
  templateUrl: './hms-video.component.html',
  styleUrls: ['./hms-video.component.scss'],
})
export class HmsVideoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() embeddedVideoStream: IEmbeddedVideoStream;

  @Output() beamStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentUser: ICurrentUser;

  EHmsStates = EHmsStates;
  hmsState: EHmsStates;

  serverClient: IHmsClient;
  selectedRole: EHmsRoles;

  channelSubscription;
  isInitialConnection = true;
  subscriptions: Subscription[] = [];

  constructor(
    private authWatchService: LibAuthwatchService,
    private hmsVideoStateService: HmsVideoStateService,
    private hmsApiService: HmsApiService,
    private hmsLiveChannel: HmsLiveChannel,
    private hmsStageService: HmsStageService,
  ) {}

  ngOnInit(): void {
    // Set the initial hms state
    // TODO: set this as per the user's role [webinar, or conference]
    // this.hmsVideoStateService.setState(EHmsStates.INIT);

    // Subscribe to hms state service
    this.subscriptions.push(
      this.hmsVideoStateService.hmsState$.subscribe((value: EHmsStates) => {
        this.hmsState = value;
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.embeddedVideoStream.hms_room_id) {
      // Get current user
      this.subscriptions.push(
        this.authWatchService.currentUser$.subscribe((value: ICurrentUser) => {
          this.currentUser = value;
          // Get client token
          this.getClient();
        }),
      );
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions
    this.channelSubscription?.unsubscribe();
    this.hmsLiveChannel.unsubscribe(this.currentUser.id);
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  getClient(): void {
    this.subscriptions.push(
      this.hmsApiService.getClientToken(this.embeddedVideoStream.hms_room_id).subscribe((value: IHmsClient) => {
        this.serverClient = value;
        this.connectToChannel();
      }),
    );
  }

  connectToChannel(): void {
    // Subscribe to channel
    this.channelSubscription = this.hmsLiveChannel.subscribe(
      this.embeddedVideoStream.hms_room_id,
      this.currentUser.id,
      this.serverClient.token,
      this.currentUser.name,
      this.selectedRole,
    );

    // Check if session has ended
    this.hmsLiveChannel.channelData$[this.currentUser.id].subscribe((data: any) => {
      if (data) {
        switch (data.action) {
          case this.hmsLiveChannel.ACTIONS.SET_PERMISSIONS: {
            if (this.isInitialConnection) {
              if (data.room_ended) {
                this.hmsVideoStateService.setState(EHmsStates.ENDED);
              } else {
                this.hmsVideoStateService.setState(EHmsStates.INIT);
              }

              if (data.raised_hands.length) {
                data.raised_hands.forEach((userId: number) =>
                  this.hmsStageService.raiseHand(typeof userId === 'string' ? parseInt(userId) : userId),
                );
              }

              this.isInitialConnection = false;
            }
            break;
          }
        }
      }
    });
  }

  reload() {
    window.location.reload();
  }
}
