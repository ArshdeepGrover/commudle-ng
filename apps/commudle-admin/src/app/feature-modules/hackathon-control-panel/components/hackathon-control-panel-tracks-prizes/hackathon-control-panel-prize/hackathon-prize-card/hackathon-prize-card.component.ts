import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { countries_details } from '@commudle/shared-services';
import { NbDialogService } from '@commudle/theme';
import { HackathonService } from 'apps/commudle-admin/src/app/services/hackathon.service';
import { IHackathonPrize } from 'apps/shared-models/hackathon-prize.model';
import { IHackathonUserResponses } from 'apps/shared-models/hackathon-user-responses.model';
import { IHackathonWinner } from 'apps/shared-models/hackathon-winner.model';
import { IHackathonTeam } from 'apps/shared-models/hackathon-team.model';
import { HackathonWinnerService } from 'apps/commudle-admin/src/app/services/hackathon-winner.service';

@Component({
  selector: 'commudle-hackathon-prize-card',
  templateUrl: './hackathon-prize-card.component.html',
  styleUrls: ['./hackathon-prize-card.component.scss'],
})
export class HackathonPrizeCardComponent implements OnInit {
  @Input() hackathonPrize: IHackathonPrize;
  @Output() editPrizeEvent: EventEmitter<IHackathonPrize> = new EventEmitter();
  @Output() destroyPrizeEvent: EventEmitter<number> = new EventEmitter();
  countryDetails = countries_details;
  prizeCurrencySymbol: any;
  hackathonUserResponses: IHackathonUserResponses[];
  constructor(
    private nbDialogService: NbDialogService,
    private hackathonService: HackathonService,
    private hackathonWinnerService: HackathonWinnerService,
  ) {}

  ngOnInit() {
    this.prizeCurrencySymbol = this.countryDetails.find(
      (detail) => detail.currency === this.hackathonPrize.currency_type,
    );
  }

  editPrize(prize) {
    this.editPrizeEvent.emit(prize);
  }

  deletePrize(hackathonPrizeId) {
    this.destroyPrizeEvent.emit(hackathonPrizeId);
  }

  openPrizeDistributionDialogBox(dialog) {
    this.hackathonService.indexUserResponses(this.hackathonPrize.hackathon_id).subscribe((data) => {
      if (data) {
        this.hackathonUserResponses = data;
      }
    });
    this.nbDialogService.open(dialog, {});
  }

  addWinner(team: IHackathonTeam, index: number) {
    this.hackathonWinnerService
      .addHackathonWinner(this.hackathonPrize.id, team.id)
      .subscribe((data: IHackathonWinner) => {
        // this.hackathonUserResponses[index].team.hackathon_winners.push(data);
      });
  }
}
