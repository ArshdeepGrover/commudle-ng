import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserRolesUsersService } from 'apps/commudle-admin/src/app/services/user_roles_users.service';
import { ICommunity } from 'apps/shared-models/community.model';
import { IUser } from 'apps/shared-models/user.model';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { PublicCommunityModule } from 'apps/commudle-admin/src/app/feature-modules/public-community/public-community.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communities-card',
  templateUrl: './communities-card.component.html',
  styleUrls: ['./communities-card.component.scss'],
  standalone: true,
  imports: [RouterModule, PublicCommunityModule, CommonModule],
})
export class CommunitiesCardComponent implements OnInit, OnDestroy {
  @Input() community: ICommunity;
  @Input() horizontalScroll = false;

  members: IUser[] = [];
  count = 4;
  page = 1;

  subscription: Subscription;

  constructor(private userRolesUsersService: UserRolesUsersService) {}

  ngOnInit(): void {
    this.getMembers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMembers(): void {
    this.subscription = this.userRolesUsersService
      .pGetCommunityMembers(this.community.id, this.page, this.count)
      .subscribe((value) => {
        this.members = value.users;
      });
  }
}
