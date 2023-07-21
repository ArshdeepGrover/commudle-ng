import { Component, OnInit } from '@angular/core';
// import { LabsService } from 'apps/commudle-admin/src/app/feature-modules/labs/services/labs.service';
// import { ILab } from 'apps/shared-models/lab.model';
// import { ILabs } from 'apps/shared-models/labs.model';
// import { ITag } from 'apps/shared-models/tag.model';
// import { ITags } from 'apps/shared-models/tags.model';
import { SeoService } from 'apps/shared-services/seo.service';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss'],
})
export class LabsComponent implements OnInit {
  isMobileView: boolean;
  // page = 1;
  // count = 9;
  // total = -1;

  // popularTags: ITag[] = [];
  // popularLabs: ILab[] = [];

  // searchedTags: string[] = [];
  // searchedLabs: ILab[] = [];

  // isLoading = false;

  constructor(private seoService: SeoService) {}

  // constructor(private labsService: LabsService, private seoService: SeoService) {}

  ngOnInit() {
    // this.getPopularTags();
    // this.getLabsByTags();
    this.isMobileView = window.innerWidth <= 640;
    this.seoService.setTags(
      'Guided Tutorials by Software Developers & Designers',
      'Labs are guided hands-on tutorials published by software developers. They teach you algorithms, help you create  apps & projects and cover topics including Web, Flutter, Android, iOS, Data Structures, ML & AI.',
      `https://commudle.com/assets/images/commudle-logo192.png`,
    );
  }

  // getPopularTags() {
  //   this.labsService.pTags().subscribe((data: ITags) => (this.popularTags = data.tags.slice(0, 6)));
  // }

  // onTagAdd(value: string) {
  //   if (!this.searchedTags.includes(value)) {
  //     this.searchedTags.push(value);
  //     this.total = -1;
  //     this.page = 1;
  //     this.count = 9;
  //     this.getLabsByTags(true);
  //   }
  // }

  // onTagsUpdate(tags: string[]) {
  //   this.searchedTags = tags || [];
  //   this.total = -1;
  //   this.page = 1;
  //   this.count = 9;
  //   this.getLabsByTags(true);
  // }

  // getLabsByTags(replace: boolean = false): void {
  //   this.isLoading = true;
  //   this.labsService.searchLabsByTags(this.searchedTags, this.page, this.count).subscribe((value: ILabs) => {
  //     this.searchedLabs = replace ? value.labs : this.searchedLabs.concat(value.labs);
  //     this.total = value.total;
  //     this.count = value.count;
  //     this.page++;
  //     this.isLoading = false;
  //   });
  // }
}
