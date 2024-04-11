import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IReadingBook } from 'apps/shared-models/reading_book.model';
import { CmsService } from 'apps/shared-services/cms.service';
import { SeoService } from 'apps/shared-services/seo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'commudle-features-content',
  templateUrl: './features-content.component.html',
  styleUrls: ['./features-content.component.scss'],
})
export class FeaturesContentComponent implements OnInit {
  features = [];
  isLoading = true;
  featureData: any;
  subscriptions: Subscription[] = [];

  constructor(private cmsService: CmsService, private activatedRoute: ActivatedRoute, private seoService: SeoService) {
    activatedRoute.params.subscribe(() => {
      this.getChaptersData();
    });
  }

  ngOnInit(): void {
    this.getIndex();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getIndex() {
    const fields = '_id, slug, chapter_name, chapter_number';
    const order = 'chapter_number asc';
    this.cmsService.getDataByTypeFieldOrder('book', fields, order).subscribe((data) => {
      if (data) {
        this.features = data;
      }
    });
  }

  getChaptersData() {
    this.isLoading = true;
    this.featureData = null;
    const slug: string = this.activatedRoute.snapshot.params.slug;
    this.subscriptions.push(
      this.cmsService.getDataBySlug(slug).subscribe((value) => {
        if (value) {
          this.featureData = value;
          this.setMeta(value.chapter_name, value?.meta_description);
        }
        this.isLoading = false;
      }),
    );
  }

  setMeta(chapter_name, description) {
    this.seoService.setTags(
      chapter_name,
      description ? description : '',
      'https://commudle.com/assets/images/commudle-logo192.png',
    );
  }
}
