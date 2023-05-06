import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@commudle/theme';
import { UserConsentsComponent } from 'apps/commudle-admin/src/app/app-shared-components/user-consents/user-consents.component';
import { UserRolesUsersService } from 'apps/commudle-admin/src/app/services/user_roles_users.service';
import { ICommunityGroup } from 'apps/shared-models/community-group.model';
import { ICommunity } from 'apps/shared-models/community.model';
import { EUserRoles } from 'apps/shared-models/enums/user_roles.enum';
import { IEvent } from 'apps/shared-models/event.model';
import { IUserRolesUser } from 'apps/shared-models/user_roles_user.model';
import { SeoService } from 'apps/shared-services/seo.service';

@Component({
  selector: 'app-user-role-confirmation',
  templateUrl: './user-role-confirmation.component.html',
  styleUrls: ['./user-role-confirmation.component.scss'],
})
export class UserRoleConfirmationComponent implements OnInit, OnDestroy {
  userRolesUser: IUserRolesUser;
  community: ICommunity;
  event: IEvent;
  communityGroup: ICommunityGroup;
  EUserRoles = EUserRoles;
  acceptRole = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userRolesUsersService: UserRolesUsersService,
    private seoService: SeoService,
    private nbDialogService: NbDialogService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => this.activateRole(data.token));

    this.seoService.setTitle('Confirm Role');
    this.seoService.noIndex(true);
  }

  ngOnDestroy() {
    this.seoService.noIndex(false);
  }

  activateRole(token) {
    this.userRolesUsersService.confirmCommunityRole(token).subscribe((data) => {
      this.userRolesUser = data.user_roles_user;
      this.community = data.community;
      this.event = data.event;
      this.communityGroup = data.community_group;

      this.onAcceptRoleButton();
    });
  }

  onAcceptRoleButton() {
    this.acceptRole = true;
    this.nbDialogService.open(UserConsentsComponent, {
      context: {
        acceptRole: this.acceptRole,
        volunteerCommunityName: this.community.name,
        volunteerEventName: this.event.name,
      },
    });
  }
}
