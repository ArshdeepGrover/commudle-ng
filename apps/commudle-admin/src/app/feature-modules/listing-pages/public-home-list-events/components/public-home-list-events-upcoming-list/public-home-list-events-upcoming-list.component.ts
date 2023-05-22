import { Component, Input, OnInit } from '@angular/core';
import { CommunitiesService } from 'apps/commudle-admin/src/app/services/communities.service';
import { IEvent } from 'apps/shared-models/event.model';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
@Component({
  selector: 'commudle-public-home-list-events-upcoming-list',
  templateUrl: './public-home-list-events-upcoming-list.component.html',
  styleUrls: ['./public-home-list-events-upcoming-list.component.scss'],
})
export class PublicHomeListEventsUpcomingListComponent implements OnInit {
  @Input() event: IEvent;
  moment = moment;
  momentTimezone = momentTimezone;
  community;

  constructor(private communitiesService: CommunitiesService) {}

  ngOnInit(): void {
    // this.getCommunityDetails();
  }

  // getCommunityDetails() {
  //   if (this.event.kommunity_id) {
  //     this.communitiesService.pGetCommunityDetails(this.event.kommunity_id).subscribe((data) => {
  //       console.log(data);
  //       this.community = data;
  //     });
  //   }
  // }
}
