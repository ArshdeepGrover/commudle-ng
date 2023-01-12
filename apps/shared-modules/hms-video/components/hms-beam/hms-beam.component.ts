import { HMSLogLevel } from '@100mslive/hms-video';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FooterService } from 'apps/commudle-admin/src/app/services/footer.service';
import { hmsActions, hmsStore } from 'apps/shared-modules/hms-video/stores/hms.store';
import { IsBrowserService } from 'apps/shared-services/is-browser.service';

@Component({
  selector: 'app-hms-beam',
  templateUrl: './hms-beam.component.html',
  styleUrls: ['./hms-beam.component.scss'],
  providers: [IsBrowserService],
})
export class HmsBeamComponent implements OnInit {
  authToken: string;

  isBrowser: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private isBrowserService: IsBrowserService,
    private footerService: FooterService,
  ) {
    this.isBrowser = this.isBrowserService.isBrowser();
  }

  ngOnInit(): void {
    hmsActions.setLogLevel(HMSLogLevel.VERBOSE);

    if (!this.isBrowser) {
      return;
    }

    this.activatedRoute.queryParams.subscribe((value: Params) => {
      this.authToken = value.authToken;

      this.joinRoom();
    });

    this.footerService.changeFooterStatus(false);
  }

  joinRoom(): void {
    hmsActions.join({
      authToken: this.authToken,
      userName: 'commudle-beam',
    });

    hmsStore.subscribe((value: boolean) => {
      if (value) {
        hmsActions.unblockAudio();
      }
    }, selectIsConnectedToRoom);
  }
}
