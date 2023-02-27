import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbWindowService } from '@commudle/theme';
import { Chart } from 'chart.js';
import { StatsEventsService } from 'apps/commudle-admin/src/app/services/stats/stats-events.service';
import { MessagesComponent } from 'apps/shared-components/messages/messages.component';
import { PollResultComponent } from 'apps/shared-components/poll-result/poll-result.component';
import { QnaComponent } from 'apps/shared-components/qna/qna.component';
import { ICommunity } from 'apps/shared-models/community.model';
import { IDiscussion } from 'apps/shared-models/discussion.model';
import { IEvent } from 'apps/shared-models/event.model';
import { IPoll } from 'apps/shared-models/poll.model';
import { SeoService } from 'apps/shared-services/seo.service';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  styleUrls: ['./event-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStatsComponent implements OnInit {
  event: IEvent;
  community: ICommunity;
  uniqueVisitors;
  registrations;
  totalRegistrations = 0;
  totalMaleRegistrations = 0;
  totalFemaleRegistrations = 0;
  totalOtherGenderRegistrations = 0;
  attendees;
  discussions: IDiscussion[] = [];
  polls: IPoll[] = [];

  entryPassesChart;
  attendeesChart;

  constructor(
    private statsEventsService: StatsEventsService,
    private activatedRoute: ActivatedRoute,
    private windowService: NbWindowService,
    private seoService: SeoService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.event = data.event;

      this.community = data.community;
      this.seoService.setTitle(`${this.event.name} Stats | ${this.community.name}`);

      this.getUniqueVisitors();
      this.getRegistrations();
      this.getAttendees();
      this.getDiscussions();
      this.getPolls();
      this.changeDetectorRef.markForCheck();
    });
  }

  getUniqueVisitors() {
    this.statsEventsService.uniqueVisitors(this.event.slug).subscribe((data) => {
      this.uniqueVisitors = data.total_unique_visitors;
      return new Chart(`${this.event.id}-event-visitors`, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Total Visits',
              data: data.chart_data,
              backgroundColor: '#5072ff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                type: 'time',
                distribution: 'series',
                time: {
                  unit: 'day',
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Day',
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Number of Visitors',
                },
              },
            ],
          },
        },
      });
      this.changeDetectorRef.markForCheck();
    });
  }

  getRegistrations() {
    if (this.event.custom_registration) {
      this.statsEventsService.customRegistration(this.event.slug).subscribe((data) => {
        this.registrations = data.chart_data;
        this.changeDetectorRef.markForCheck();
      });
    } else {
      this.statsEventsService.simpleEventRegistration(this.event.slug).subscribe((data) => {
        this.registrations = data.chart_data;
        this.calculateTotalSimpleRegistrations();
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  calculateTotalSimpleRegistrations() {
    for (const reg of this.registrations) {
      this.totalRegistrations +=
        (reg['male'] || 0) + (reg['female'] || 0) + (reg['NA'] || 0) + (reg['prefer_not_to_answer'] || 0);
      this.totalMaleRegistrations += reg['male'] || 0;
      this.totalFemaleRegistrations += reg['female'] || 0;
      this.totalOtherGenderRegistrations += (reg['NA'] || 0) + (reg['prefer_not_to_answer'] || 0);
    }
  }

  getAttendees() {
    this.statsEventsService.attendees(this.event.slug).subscribe((data) => {
      this.attendees = data.chart_data;
      this.entryPassesChart = new Chart(`entry-passes-distribution`, {
        type: 'pie',
        data: {
          datasets: [
            {
              data: [
                this.attendees.entry_passes.male,
                this.attendees.entry_passes.female,
                this.attendees.entry_passes.NA + this.attendees.entry_passes.prefer_not_to_answer,
              ],
              backgroundColor: ['blue', '#ff43bc', 'purple'],
            },
          ],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: ['Male', 'Female', 'NA'],
        },
        options: {
          responsive: true,
        },
      });

      this.entryPassesChart = new Chart(`attendees-distribution`, {
        type: 'pie',
        data: {
          datasets: [
            {
              data: [
                this.attendees.invited_attendees.male + this.attendees.uninvited_attendees.male,
                this.attendees.invited_attendees.female + this.attendees.uninvited_attendees.female,
                this.attendees.invited_attendees.NA +
                  this.attendees.invited_attendees.prefer_not_to_answer +
                  this.attendees.uninvited_attendees.NA +
                  this.attendees.uninvited_attendees.prefer_not_to_answer,
              ],
              backgroundColor: ['blue', '#ff43bc', 'purple'],
            },
          ],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: ['Male', 'Female', 'NA'],
        },
        options: {
          responsive: true,
        },
      });
      this.changeDetectorRef.markForCheck();
    });
  }

  getDiscussions() {
    this.statsEventsService.discussions(this.event.slug).subscribe((data) => {
      this.discussions = data.discussions;
      this.changeDetectorRef.markForCheck();
    });
  }

  openDiscussionWindow(discussion: IDiscussion) {
    let currentDiscussionType;
    switch (discussion.discussion_type) {
      case 'chat':
        currentDiscussionType = MessagesComponent;
        break;
      case 'question_answers':
        currentDiscussionType = QnaComponent;
        break;
    }
    this.windowService.open(currentDiscussionType, {
      title: discussion.parent_name,
      context: { discussion },
      windowClass: 'full-screen-height',
    });
  }

  getPolls() {
    this.statsEventsService.polls(this.event.slug).subscribe((data) => {
      this.polls = data.polls;
      this.changeDetectorRef.markForCheck();
    });
  }

  openPollWindow(poll: IPoll) {
    this.windowService.open(PollResultComponent, { title: 'Poll', context: { pollId: poll.id } });
  }
}
