import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbTagComponent, NbTagInputAddEvent } from '@commudle/theme';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { TrackSlotsService } from 'apps/commudle-admin/src/app/services/track_slots.service';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IEventLocationTrack } from 'apps/shared-models/event-location-track.model';
import { IEventLocation } from 'apps/shared-models/event-location.model';
import { ICommunity, IEvent } from '@commudle/shared-models';
import { DataFormEntityResponseGroupsService } from 'apps/commudle-admin/src/app/services/data-form-entity-response-groups.service';

@Component({
  selector: 'commudle-track-slot-form',
  templateUrl: './track-slot-form.component.html',
  styleUrls: ['./track-slot-form.component.scss'],
})
export class TrackSlotFormComponent implements OnInit {
  @Input() operationType: 'create' | 'edit';
  @Input() eventLocations: IEventLocation[] = [];
  @Input() eventLocationTracks: IEventLocationTrack[] = [];
  @Input() startTime;
  @Input() eventLocTrack;
  @Input() minSlotDate;
  @Input() trackSlot;
  @Input() event: IEvent;
  @Input() community: ICommunity;
  eventSpeakers;
  icons = {
    faXmark,
  };
  tags: string[] = [];
  sortedTrackSlots = {};
  trackSlotForm;

  @Output() createFormOutput = new EventEmitter<any>();
  @Output() editFormOutput = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private trackSlotsService: TrackSlotsService,
    private toastLogService: LibToastLogService,
    private dialogRef: NbDialogRef<any>,
    private dataFormEntityResponseGroupsService: DataFormEntityResponseGroupsService,
  ) {
    this.trackSlotForm = this.fb.group({
      track_slot: this.fb.group({
        event_location_track_id: ['', Validators.required],
        date: [new Date(), Validators.required],
        start_time: [new Date(), Validators.required],
        end_time: [new Date(), Validators.required],
        session_title: ['', Validators.required],
        tags_list: [''],
        track_slot_speaker_registration_ids: this.fb.array([]),
      }),
    });
  }

  ngOnInit(): void {
    this.getEventSpeakers();
    if (this.operationType === 'create') {
      this.updateNewTrackSlot();
    } else {
      this.updateExistingTrackSlot();
    }
  }

  getEventSpeakers() {
    this.dataFormEntityResponseGroupsService.getEventSpeakers(this.event.id).subscribe((data) => {
      this.eventSpeakers = data.data_form_entity_response_groups;
    });
  }

  updateNewTrackSlot() {
    this.tags = [];
    this.addSpeakerDropdown();
    const time = new Date(this.startTime);
    const endTime = new Date(time.getTime() + 30 * 60000);
    this.trackSlotForm.get('track_slot').patchValue({
      event_location_track_id: this.eventLocTrack.id,
      date: this.minSlotDate,
      start_time: time,
      end_time: endTime,
    });
  }

  updateExistingTrackSlot() {
    this.trackSlotForm.reset();
    this.removeAllDropdowns();
    for (const speakers of this.trackSlot.track_slot_speakers) {
      this.addSpeakerToDropdown(speakers.speaker_registration_id);
    }
    const sTime = this.trackSlot['start_time'];
    const eTime = this.trackSlot['end_time'];
    const sTimeArr = sTime.split('T')[1].split(':');
    const eTimeArr = eTime.split('T')[1].split(':');
    const sTimeHour = parseInt(sTimeArr[0]);
    const sTimeMinute = parseInt(sTimeArr[1]);
    const eTimeHour = parseInt(eTimeArr[0]);
    const eTimeMinute = parseInt(eTimeArr[1]);

    const sTimeNew = new Date();
    const eTimeNew = new Date();
    sTimeNew.setHours(sTimeHour);
    sTimeNew.setMinutes(sTimeMinute);

    eTimeNew.setHours(eTimeHour);
    eTimeNew.setMinutes(eTimeMinute);

    const trackDate = moment(this.trackSlot.start_time).toDate();
    const tags = this.trackSlot.tags_list ? this.trackSlot.tags_list.split(' ') : [];
    this.tags = tags;

    this.trackSlotForm.get('track_slot').patchValue({
      event_location_track_id: this.trackSlot.event_location_track_id,
      date: trackDate,
      start_time: sTimeNew,
      end_time: eTimeNew,
      session_title: this.trackSlot.session_title,
      speaker_registration_id: this.trackSlot.speaker_registration_id,
    });

    if (this.trackSlot.embedded_video_stream) {
      this.trackSlotForm.get('track_slot').patchValue({
        embedded_video_stream: this.trackSlot.embedded_video_stream,
      });
    }
  }

  addSlot() {
    const newSlot = this.trackSlotForm.get('track_slot').value;
    const tagsAsString = this.tags.map((tag) => `${tag}`).join(' ');
    newSlot.tags_list = tagsAsString;
    const startTime = moment({
      years: newSlot.date.getFullYear(),
      months: newSlot.date.getMonth(),
      date: newSlot.date.getDate(),
    });
    delete newSlot['date'];
    const sTime = newSlot['start_time'];
    newSlot['start_time'] = startTime.set({ hour: sTime.getHours(), minute: sTime.getMinutes() }).toDate();
    const eTime = newSlot['end_time'];
    newSlot['end_time'] = startTime.set({ hour: eTime.getHours(), minute: eTime.getMinutes() }).toDate();
    if (newSlot['start_time'] >= newSlot['end_time']) {
      this.toastLogService.warningDialog('End time should be greater than Start time!');
      return;
    }

    for (let i = 0; i < newSlot.track_slot_speaker_registration_ids.length; i++) {
      if (newSlot.track_slot_speaker_registration_ids[i] === '') {
        newSlot.track_slot_speaker_registration_ids.splice(i, 1);
        i--;
      }
    }

    this.trackSlotsService.createTrackSlot(newSlot).subscribe((data) => {
      this.createFormOutput.emit(data);
      this.trackSlotForm.reset();
    });
  }

  sortTrackSlots(track_slots) {
    const sortedTrackSlots = _.sortBy(track_slots, (slot) => {
      // @ts-ignore
      return new moment(slot.start_time);
    });
    return sortedTrackSlots;
  }

  editSlot(trackSlotId) {
    const slot = this.trackSlotForm.get('track_slot').value;
    const tagsAsString = this.tags.map((tag) => `${tag}`).join(' ');
    slot.tags_list = tagsAsString;
    const startTime = moment({
      years: slot.date.getFullYear(),
      months: slot.date.getMonth(),
      date: slot.date.getDate(),
    });
    delete slot['date'];
    const sTimeNew = slot['start_time'];
    slot['start_time'] = startTime.set({ hour: sTimeNew.getHours(), minute: sTimeNew.getMinutes() }).toDate();
    const eTimeNew = slot['end_time'];
    slot['end_time'] = startTime.set({ hour: eTimeNew.getHours(), minute: eTimeNew.getMinutes() }).toDate();
    if (slot['start_time'] >= slot['end_time']) {
      this.toastLogService.warningDialog('End time should be greater than Start time!');
      return;
    }

    this.trackSlotsService.updateTrackSlot(slot, trackSlotId).subscribe((data) => {
      this.editFormOutput.emit(data);
      this.trackSlotForm.reset();
    });
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
    }
    input.nativeElement.value = '';
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.tags = this.tags.filter((tag) => tag !== tagToRemove.text);
  }

  speakerSelected(event, index) {
    const selectedSpeakerId = Number(event.target.value);
    const speakerIdsArray = this.trackSlotForm.get('track_slot.track_slot_speaker_registration_ids') as FormArray;
    speakerIdsArray.at(index).setValue(selectedSpeakerId);
  }

  addSpeakerDropdown() {
    const speakerControl = this.fb.control('');
    const speakerIdsArray = this.trackSlotForm.get('track_slot.track_slot_speaker_registration_ids') as FormArray;
    speakerIdsArray.push(speakerControl);
  }

  addSpeakerToDropdown(value) {
    const speakerIdsArray = this.trackSlotForm.get('track_slot.track_slot_speaker_registration_ids') as FormArray;
    speakerIdsArray.push(this.fb.control(value));
  }

  removeSpeakerDropdown(index: number) {
    const speakerIdsArray = this.trackSlotForm.get('track_slot.track_slot_speaker_registration_ids') as FormArray;

    // Check if the index is valid before attempting to remove the control.
    if (index >= 0 && index < speakerIdsArray.length) {
      speakerIdsArray.removeAt(index);
    }
  }

  removeAllDropdowns() {
    const speakerIdsArray = this.trackSlotForm.get('track_slot.track_slot_speaker_registration_ids') as FormArray;
    while (speakerIdsArray.length > 0) {
      speakerIdsArray.removeAt(0);
    }
  }
  close() {
    this.dialogRef.close();
  }
}
