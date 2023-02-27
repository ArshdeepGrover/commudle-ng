import { NbWindowService } from '@commudle/theme';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { StatsCommunitiesService } from 'apps/commudle-admin/src/app/services/stats/stats-communities.service';
import { IFixedEmail } from 'apps/shared-models/fixed-email.model';
import * as moment from 'moment';

@Component({
  selector: 'app-community-emails-list',
  templateUrl: './community-emails-list.component.html',
  styleUrls: ['./community-emails-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityEmailsListComponent implements OnInit {
  @ViewChild('emailMessageTemplate') emailMessageTemplate: TemplateRef<any>;
  @Input() communityId;
  moment = moment;
  emails: IFixedEmail[] = [];
  constructor(
    private statsCommunitiesService: StatsCommunitiesService,
    private windowService: NbWindowService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getEmails();
  }

  getEmails() {
    this.emails = [];
    this.statsCommunitiesService.emails(this.communityId).subscribe((data) => {
      this.emails = data.fixed_emails;
      this.changeDetectorRef.markForCheck();
    });
  }

  openEmailPreview(email: IFixedEmail) {
    this.windowService.open(this.emailMessageTemplate, {
      title: email.subject,
      context: {
        message: email.message,
      },
    });
  }
}
