import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HackathonService } from 'apps/commudle-admin/src/app/services/hackathon.service';
import { IHackathonTrack } from 'apps/shared-models/hackathon-track.model';
import { IHackathonPrize } from 'apps/shared-models/hackathon-prize.model';
import { countries_details } from '@commudle/shared-services';
import { NbDialogService } from '@commudle/theme';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'commudle-hackathon-track-card',
  templateUrl: './hackathon-track-card.component.html',
  styleUrls: ['./hackathon-track-card.component.scss'],
})
export class HackathonTrackCardComponent implements OnInit {
  @Input() hackathonTrack: IHackathonTrack;
  @Output() editTrackEvent: EventEmitter<IHackathonTrack> = new EventEmitter();
  @Output() destroyTrackEvent: EventEmitter<number> = new EventEmitter();

  countryDetails = countries_details;
  faXmark = faXmark;
  constructor(private hackathonService: HackathonService, private nbDialogService: NbDialogService) {}

  ngOnInit() {}

  edit(hackathonTrack) {
    this.editTrackEvent.emit(hackathonTrack);
  }

  deleteTrack(trackId) {
    this.destroyTrackEvent.emit(trackId);
  }

  editPrize(prize) {}

  confirmDeleteDialogBox(dialog, prizeId, index) {
    this.nbDialogService.open(dialog, {
      context: { index: index, prizeId: prizeId },
    });
  }

  deletePrize(prizeId, index) {
    this.hackathonService.destroyPrize(prizeId).subscribe((data) => {
      if (data) this.hackathonTrack.hackathon_prizes.splice(index, 1);
    });
  }
}
