import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommunityBuildsService } from 'apps/commudle-admin/src/app/services/community-builds.service';
import { ICommunityBuild } from 'apps/shared-models/community-build.model';
import { SeoService } from 'apps/shared-services/seo.service';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-community-build',
  templateUrl: './community-build.component.html',
  styleUrls: ['./community-build.component.scss'],
})
export class CommunityBuildComponent implements OnInit {
  communityBuild: ICommunityBuild;
  moment = moment;

  constructor(
    private seoService: SeoService,
    private activatedRoute: ActivatedRoute,
    private communityBuildsService: CommunityBuildsService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap((data: Params) => {
          return this.communityBuildsService.pShow(data.community_build_id);
        }),
      )
      .subscribe((data: ICommunityBuild) => {
        this.communityBuild = data;

        this.seoService.setTags(
          `${data.name} | By ${data.user.name}`,
          data.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
          data.images[0]?.url || 'https://commudle.com/assets/images/commudle-logo192.png',
        );
      });
  }
}
