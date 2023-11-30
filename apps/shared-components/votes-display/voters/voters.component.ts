import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { SVotesService } from 'apps/shared-components/services/s-votes.service';
import { IUser } from 'apps/shared-models/user.model';
import { NbDialogService } from '@commudle/theme';

@Component({
  selector: 'app-voters',
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.scss'],
})
export class VotersComponent implements OnInit {
  @ViewChild('votersList') votersList: TemplateRef<any>;

  @Input() votableType;
  @Input() votableId;

  page = 1;
  count = 10;
  total;
  isLoading = true;

  voters: IUser[] = [];

  constructor(private votesService: SVotesService, private dialogService: NbDialogService) {}

  ngOnInit() {
    this.getVoters();
  }

  getVoters() {
    this.votesService.pGetVoters(this.votableType, this.votableId, this.page, this.count).subscribe((data) => {
      this.voters = this.voters.concat(data.users);
      this.total = data.total;
      this.page += 1;
      this.isLoading = false;
    });
  }

  openWindow() {
    this.getVoters();
    this.dialogService.open(this.votersList);
  }
}
