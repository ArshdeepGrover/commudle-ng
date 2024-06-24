import { Component, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from 'apps/shared-services/cms.service';
import { SeoService } from 'apps/shared-services/seo.service';
import { FooterService } from 'apps/commudle-admin/src/app/services/footer.service';
import { ICaseStudy } from 'apps/shared-models/case-study.model';

@Component({
  selector: 'commudle-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss'],
})
export class CaseStudiesComponent implements OnInit, OnDestroy {
  caseStudies: ICaseStudy[] = [];
  isLoading = true;

  constructor(private cmsService: CmsService, private seoService: SeoService, private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.changeFooterStatus(true);
    this.getCaseStudies();
    this.setMeta();
  }

  ngOnDestroy(): void {
    this.footerService.changeFooterStatus(false);
  }

  getCaseStudies() {
    const fields = 'title, tagline, slug, bannerImage, metaDescription';
    this.cmsService.getDataByTypeFieldOrder('caseStudy', fields).subscribe((value) => {
      this.caseStudies = value;
      this.isLoading = false;
    });
  }

  setMeta(): void {
    this.seoService.setTags(
      'Case Studies',
      'Get to know how DevRels around the world have used Commudle to build scalable ecosystems and engagments to solve for their specific use cases.',
      'https://commudle.com/assets/images/commudle-logo192.png',
    );
  }
}