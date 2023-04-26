import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NbSidebarService, NbSidebarState } from '@commudle/theme';
import { environment } from 'apps/commudle-admin/src/environments/environment';
import { ICurrentUser } from 'apps/shared-models/current_user.model';
import { ActionCableConnectionSocket } from 'apps/shared-services/action-cable-connection.socket';
import { ApiRoutesService } from 'apps/shared-services/api-routes.service';
import { IsBrowserService } from 'apps/shared-services/is-browser.service';
import { LibAuthwatchService } from 'apps/shared-services/lib-authwatch.service';
import { NotificationsService } from 'apps/shared-services/notifications/notifications.service';
import { PioneerAnalyticsService } from 'apps/shared-services/pioneer-analytics.service';
import { SeoService } from 'apps/shared-services/seo.service';
import { CookieConsentService } from './services/cookie-consent.service';
import { ProfileStatusBarService } from './services/profile-status-bar.service';

@Component({
  selector: 'commudle-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  sideBarState: NbSidebarState = 'collapsed';
  currentUser: ICurrentUser;
  cookieAccepted = false;
  profileBarStatus = true;
  isBrowser;

  constructor(
    private apiRoutes: ApiRoutesService,
    private authWatchService: LibAuthwatchService,
    private actionCableConnectionSocket: ActionCableConnectionSocket,
    private sidebarService: NbSidebarService,
    private cookieConsentService: CookieConsentService,
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private pioneerAnalyticsService: PioneerAnalyticsService,
    private profileStatusBarService: ProfileStatusBarService,
    private isBrowserService: IsBrowserService,
    private seoService: SeoService,
    private router: Router,
  ) {
    this.apiRoutes.setBaseUrl(environment.base_url);
    this.actionCableConnectionSocket.setBaseUrl(environment.anycable_url);
    this.isBrowser = this.isBrowserService.isBrowser();
  }

  ngOnInit(): void {
    const host = window.location.hostname;
    if (['test'].includes(host)) {
      this.seoService.noIndex(true);
    }
    this.seoService.setCanonical();
    this.authWatchService.currentUser$.subscribe((currentUser: ICurrentUser) => {
      this.currentUser = currentUser;

      if (this.isBrowser) {
        this.actionCableConnectionSocket.connectToServer();
        this.notificationsService.subscribeToNotifications();

        if (this.currentUser) {
          // this.pioneerAnalyticsService.startAnalytics(this.currentUser.id);
        }
      }
    });
    if (this.cookieConsentService.isCookieConsentAccepted()) {
      this.cookieAccepted = true;
    }

    this.removeSchemaOnRouteChange();
  }

  ngAfterViewChecked(): void {
    this.profileStatusBarService.profileBarStatus$.subscribe((value) => (this.profileBarStatus = value));
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.notificationsService.unsubscribeFromNotifications();
  }

  closeSidebar(): void {
    if (this.sideBarState === 'expanded') {
      this.sidebarService.collapse('mainMenu');
    }
  }

  /**
   * remove the ld+json on route change
   */
  removeSchemaOnRouteChange(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.seoService.removeSchema();
      }
    });
  }
}
