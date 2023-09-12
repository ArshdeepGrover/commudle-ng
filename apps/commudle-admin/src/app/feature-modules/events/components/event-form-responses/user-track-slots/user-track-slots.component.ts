import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ICommunity, IEvent, IUser } from '@commudle/shared-models';
import { NbDialogRef, NbDialogService } from '@commudle/theme';
import { TrackSlotFormComponent } from 'apps/commudle-admin/src/app/feature-modules/events/components/event-locations/event-location-tracks/track-slot-form/track-slot-form.component';
import { EventLocationsService } from 'apps/commudle-admin/src/app/services/event-locations.service';
import { TrackSlotsService } from 'apps/commudle-admin/src/app/services/track_slots.service';
import { IEventLocation } from 'apps/shared-models/event-location.model';
import { ITrackSlot } from 'apps/shared-models/track-slot.model';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import * as moment from 'moment';

@Component({
  selector: 'commudle-user-track-slots',
  templateUrl: './user-track-slots.component.html',
  styleUrls: ['./user-track-slots.component.scss'],
})
export class UserTrackSlotsComponent implements OnInit {
  @Input() trackSlots: ITrackSlot[];
  @Input() speakers;
  @Input() event: IEvent;
  @Input() community: ICommunity;
  eventLocations: IEventLocation[];
  moment = moment;
  dialogRef: NbDialogRef<any>;

  @ViewChild('deleteTrackSlotTemplate') deleteTrackSlotTemplate: TemplateRef<any>;

  constructor(
    private dialogService: NbDialogService,
    private eventLocationsService: EventLocationsService,
    private trackSlotsService: TrackSlotsService,
    private toastLogService: LibToastLogService,
  ) {}
  speaker: IUser[] = [];
  minSlotDate;

  ngOnInit(): void {
    for (const speaker of this.speakers) {
      if (speaker.registration_status.name === 'confirmed') {
        this.speaker.push(speaker);
      }
    }
    this.minSlotDate = moment(this.event.start_time).toDate();
    this.getEventLocations();
  }

  getEventLocations() {
    this.eventLocationsService.getEventLocations(this.event.slug).subscribe((data) => {
      this.eventLocations = data.event_locations;
      for (const eventLocation of this.eventLocations) {
        for (const eventLocationTrack of eventLocation.event_location_tracks) {
          for (const trackSlot of this.trackSlots) {
            if (trackSlot.event_location_track_id === eventLocationTrack.id) {
              trackSlot.event_location_track_name = eventLocationTrack.name;
            }
          }
        }
      }
    });
  }

  editTrackSlot(trackSlot, index) {
    this.dialogRef = this.dialogService.open(TrackSlotFormComponent, {
      context: {
        operationType: 'edit',
        eventLocations: this.eventLocations,
        eventSpeakers: this.speaker,
        minSlotDate: this.minSlotDate,
        trackSlot: trackSlot,
      },
    });
    this.dialogRef.componentRef.instance.editFormOutput.subscribe((data) => {
      this.trackSlots[index] = data;
      this.toastLogService.successDialog('Track slot Updated');
      this.dialogRef.close();
    });
  }

  showAddSlotForm() {
    this.dialogRef = this.dialogService.open(TrackSlotFormComponent, {
      context: {
        operationType: 'create',
        eventLocations: this.eventLocations,
        eventSpeakers: this.speaker,
        eventLocTrack: this.eventLocations,
        startTime: this.minSlotDate,
        minSlotDate: this.minSlotDate,
        community: this.community,
        event: this.event,
      },
    });
    this.dialogRef.componentRef.instance.createFormOutput.subscribe((data) => {
      this.toastLogService.successDialog('New track slot added');
      this.trackSlots.unshift(data);
      this.dialogRef.close();
    });
  }

  confirmDeleteSlot(trackSlot, index) {
    this.dialogService.open(this.deleteTrackSlotTemplate, {
      context: {
        trackSlot: trackSlot,
        index: index,
      },
    });
  }

  deleteSlot(trackSlot, index) {
    this.trackSlotsService.deleteTrackSlot(trackSlot.id).subscribe((data) => {
      this.toastLogService.successDialog('Deleted');
    });
  }
}
