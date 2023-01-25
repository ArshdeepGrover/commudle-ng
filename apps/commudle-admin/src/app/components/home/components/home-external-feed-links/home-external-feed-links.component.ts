import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HomeService } from 'apps/commudle-admin/src/app/services/home.service';
import { IFeedItem } from 'apps/shared-models/feed-item.model';

@Component({
  selector: 'app-home-external-feed-links',
  templateUrl: './home-external-feed-links.component.html',
  styleUrls: ['./home-external-feed-links.component.scss'],
})
export class HomeExternalFeedLinksComponent implements OnInit {
  feedItems: IFeedItem[] = [];

  isBrowser: boolean;

  constructor(private homeService: HomeService, @Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getFeed();
    }
  }

  getFeed(): void {
    this.homeService.pFeed().subscribe((data) => (this.feedItems = data.feed_items.slice(0, 3)));
  }
}
