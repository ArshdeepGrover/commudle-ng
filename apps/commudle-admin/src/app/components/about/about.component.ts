import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import { SanityImageObject } from '@sanity/image-url/lib/types/types';
import { ICMSAbout } from 'apps/commudle-admin/src/app/components/about/models/about-cms.model';
import { CmsService } from 'apps/shared-services/cms.service';
import { SeoService } from 'apps/shared-services/seo.service';
import { staticAssets } from 'apps/commudle-admin/src/assets/static-assets';
import { FooterService } from 'apps/commudle-admin/src/app/services/footer.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  ICmsAbout: ICMSAbout;
  staticAssets = staticAssets;

  constructor(private cmsService: CmsService, private seoService: SeoService, private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.changeFooterStatus(true);
    this.setMeta();
    this.getData();

    this.seoService.noIndex(true);
  }

  ngOnDestroy() {
    this.footerService.changeFooterStatus(false);
    this.seoService.noIndex(false);
  }

  setMeta(): void {
    this.seoService.setTags(
      'About - Commudle',
      'Commudle helps businesses to build and scale developer programs globally. We are a developer ecosystem where developers can engage, share knowledge, opportunities and grow in their career journeys.',
      'https://commudle.com/assets/images/commudle-logo192.png',
    );
  }

  getData(): void {
    this.cmsService.getDataBySlug('about-page').subscribe((value) => {
      this.ICmsAbout = value;
    });
  }

  getImageUrl(value: SanityImageObject): ImageUrlBuilder {
    if (!value) return null;

    return this.cmsService.getImageUrl(value);
  }
}
