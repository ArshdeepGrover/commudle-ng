import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule } from '@commudle/theme';
import { faBullhorn, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SeoService } from 'apps/shared-services/seo.service';
import { WhatsNewService } from 'apps/shared-services/whats-new.service';
import moment from 'moment';

@Component({
  selector: 'commudle-whats-new',
  standalone: true,
  imports: [CommonModule, NbCardModule, FontAwesomeModule],
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.scss'],
})
export class WhatsNewComponent implements OnInit {
  showPopup = false;
  cookieCreationTime;
  lastUpdatedDate: string;
  updates = [];
  newUpdates;
  faBullhorn = faBullhorn;
  faXmark = faXmark;

  constructor(private whatsNewService: WhatsNewService, private seoService: SeoService) {}

  ngOnInit(): void {
    if (!this.seoService.isBot) {
      this.updates = [];
      this.whatsNewService.getNewUpdates().subscribe((data) => {
        this.newUpdates = data;
        const pastTime = new Date(moment().subtract(2, 'months').format());
        this.cookieCreationTime = new Date(this.whatsNewService.getCookieByName('last_update_seen'));
        const date = this.whatsNewService.getCookieByName('last_update_seen') ? this.cookieCreationTime : pastTime;
        for (const newUpdate of this.newUpdates) {
          if (new Date(newUpdate.date) > date) {
            this.updates.push(newUpdate);
          }
        }
        if (this.updates.length > 0) {
          this.showPopup = true;
          setTimeout(() => {
            this.whatsNewService.setCookieCreationTime('last_update_seen');
          }, 5000);
        }
      });
    }
  }

  closePopup() {
    this.showPopup = false;
  }
}
