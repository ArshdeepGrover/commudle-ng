import { Component, OnInit, Input } from '@angular/core';
import _ from 'lodash';
import { NotificationService } from 'projects/commudle-admin/src/app/feature-modules/notifications/services/notification.service';
import { INotification } from 'projects/shared-models/notification.model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ENotificationStatuses } from 'projects/shared-models/enums/notification_statuses.enum';

@Component({
  selector: 'app-community-notification',
  templateUrl: './community-notification.component.html',
  styleUrls: ['./community-notification.component.scss'],
})
export class CommunityNotificationComponent implements OnInit {
  @Input() id = 0;

  isLoading = false;

  page = 1;
  count = 10;
  total: number;

  canLoadMore = true;

  moment = moment;
  ENotificationStatuses = ENotificationStatuses;

  notifications: INotification[] = [];

  subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    console.log('id is' + this.id);
    this.getNotifications();
  }

  changeStatus(status: ENotificationStatuses, notification: INotification) {
    this.subscriptions.push(this.notificationService.updateNotificationStatus(status, notification.id).subscribe());
  }

  getNotifications() {
    console.log('works1');

    if (!this.isLoading && (!this.total || this.notifications.length < this.total)) {
      console.log('works2');
      this.isLoading = true;
      this.subscriptions.push(
        this.notificationService.getCommunityNotifications(this.id, this.page, this.count).subscribe((value) => {
          console.log('works3');
          this.notifications = _.uniqBy(this.notifications.concat(value.notifications), 'id');
          this.page += 1;
          this.total = value.total;
          console.log('works3');
          this.isLoading = false;
          if (this.notifications.length >= this.total) {
            this.canLoadMore = false;
            console.log('works4');
          }
        }),
      );
    }
  }
}
