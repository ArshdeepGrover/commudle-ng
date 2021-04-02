import { IUser } from 'projects/shared-models/user.model';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUsersService } from 'projects/commudle-admin/src/app/services/app-users.service';
import { ICurrentUser } from 'projects/shared-models/current_user.model';
import { LibAuthwatchService } from 'projects/shared-services/lib-authwatch.service';
import { Meta, Title } from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {FooterService} from 'projects/commudle-admin/src/app/services/footer.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {

  user: IUser;
  currentUser: ICurrentUser;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private authWatchService: LibAuthwatchService,
    private usersService: AppUsersService,
    private footerService: FooterService,
    private meta: Meta,
    private title: Title
  ) {
  }

  ngOnInit(): void {
    // Get user's data
    this.getUserData();


    this.subscriptions.push(
      this.authWatchService.currentUser$.subscribe(
        data => {
          this.currentUser = data;
          if (this.currentUser) {
            this.setMeta();
          }
        }
      )
    );
    // Hide Footer
    this.footerService.changeFooterStatus(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    // Show Footer
    this.footerService.changeFooterStatus(true);
  }

  // Get user's data
  getUserData() {
    this.usersService.getProfile(this.activatedRoute.snapshot.params.username).subscribe(data => this.user = data);
  }


  setMeta() {
    this.meta.updateTag({
      name: 'robots',
      content: 'noindex'
    });

    this.title.setTitle(`${this.currentUser.name}`)
    this.meta.updateTag({ name: 'description', content: `${this.currentUser.designation}`});


    this.meta.updateTag({ name: 'og:image', content: this.currentUser.avatar });
    this.meta.updateTag({ name: 'og:image:secure_url', content: this.currentUser.avatar });
    this.meta.updateTag({ name: 'og:title', content: `${this.currentUser.name}` });
    this.meta.updateTag({ name: 'og:description', content: `${this.currentUser.designation}`});
    this.meta.updateTag( { name: 'og:type', content: 'website'});

    this.meta.updateTag({ name: 'twitter:image', content: this.currentUser.avatar });
    this.meta.updateTag({ name: 'twitter:title', content: `${this.currentUser.name}` });
    this.meta.updateTag({ name: 'twitter:description', content: `${this.currentUser.designation}`});
  }

}
