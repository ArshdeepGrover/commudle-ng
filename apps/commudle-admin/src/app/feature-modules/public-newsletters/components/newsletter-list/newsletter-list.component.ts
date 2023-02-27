import { Component, OnDestroy, OnInit } from '@angular/core';
import { PublicNewslettersService } from 'apps/commudle-admin/src/app/feature-modules/public-newsletters/services/public-newsletters.service';
import { IMainNewsletter } from 'apps/shared-models/main-newsletter.model';
import { SeoService } from 'apps/shared-services/seo.service';
import { Subscription } from 'rxjs';
import { FooterService } from 'apps/commudle-admin/src/app/services/footer.service';

@Component({
  selector: 'app-newsletter-list',
  templateUrl: './newsletter-list.component.html',
  styleUrls: ['./newsletter-list.component.scss'],
})
export class NewsletterListComponent implements OnInit, OnDestroy {
  newsletters: IMainNewsletter[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private publicNewslettersService: PublicNewslettersService,
    private seoService: SeoService,
    private footerService: FooterService,
  ) {}

  ngOnInit(): void {
    this.footerService.changeFooterStatus(true);
    this.seoService.setTags(
      'Commudle IDE: Newsletters from the Community',
      'We publish every month from different activities, events, channels, projects, tutorials and more from the techies, developers & designers around you!',
      'https://commudle.com/assets/images/commudle-logo192.png',
    );
    this.getPublishedNewsletters();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.footerService.changeFooterStatus(false);
  }

  getPublishedNewsletters() {
    this.subscriptions.push(
      this.publicNewslettersService.publicIndex().subscribe((data) => {
        this.newsletters = data.main_newsletters;
      }),
    );
  }
}
