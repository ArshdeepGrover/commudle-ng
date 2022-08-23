import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { LibToastLogService } from 'projects/shared-services/lib-toastlog.service';
import { IUser } from 'projects/shared-models/user.model';
import { CmsService } from 'projects/shared-services/cms.service';
import { Subscription } from 'rxjs';
import { IBlog } from 'projects/commudle-admin/src/app/feature-modules/public-blogs/models/blogs.model';
import { AppUsersService } from 'projects/commudle-admin/src/app/services/app-users.service';
import { SeoService } from 'projects/shared-services/seo.service';
import { environment } from 'projects/commudle-admin/src/environments/environment';
import { NavigatorShareService } from 'projects/shared-services/navigator-share.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, OnDestroy {
  @Input() activateMiniProfileDirective = true;
  blog: IBlog;
  richText: string;
  user: IUser;

  subscriptions: Subscription[] = [];

  isLoading = false;

  environment = environment;

  constructor(
    private cmsService: CmsService,
    private activatedRoute: ActivatedRoute,
    private appUsersService: AppUsersService,
    private seoService: SeoService,
    private navigatorShareService: NavigatorShareService,
    private libToastLogService: LibToastLogService,
    private clipboard: Clipboard,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  imageUrl(source: any) {
    return this.cmsService.getImageUrl(source);
  }

  getData() {
    this.isLoading = true;
    const slug: string = this.activatedRoute.snapshot.params.id;
    this.cmsService.getDataBySlug(slug).subscribe((value: IBlog) => {
      this.blog = value;
      this.richText = this.cmsService.getHtmlFromBlock(value);
      this.setUser();
      this.setMeta();
    });
    this.isLoading = false;
  }
  setUser() {
    this.subscriptions.push(
      this.appUsersService.getProfile(this.blog.username).subscribe((data) => (this.user = data)),
    );
  }
  setMeta(): void {
    this.seoService.setTags(
      this.blog.title + ' -commudle',
      this.blog.meta_description,
      this.imageUrl(this.blog.headerImage).url(),
    );
  }
  copyTextToClipboard(title, slug): void {
    if (!this.navigatorShareService.canShare()) {
      if (this.clipboard.copy(`${environment.app_url}/blogs/${slug}`)) {
        this.libToastLogService.successDialog('Copied the message successfully!');
      }
      return;
    }
    this.navigatorShareService
      .share({
        title: `${title}`,
        text: `${title}`,
        url: `${environment.app_url}/blogs/${slug}`,
      })
      .then(() => {
        this.libToastLogService.successDialog('Shared successfully!');
      });
  }
}
