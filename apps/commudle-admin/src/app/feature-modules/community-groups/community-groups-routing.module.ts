import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EUserRoles } from 'apps/shared-models/enums/user_roles.enum';
import { AuthGuard } from 'apps/shared-services/lib-authwatch.guard';
import { CommunityGroupFormComponent } from './components/community-group-form/community-group-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommunitiesComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/communities/communities.component';
import { AdminTeamComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/admin-team/admin-team.component';
import { MembersListComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/members-list/members-list.component';
import { ChannelsComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/communities/channels/channels.component';
import { EventsComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/communities/events/events.component';
import { CommunityComponent } from 'apps/commudle-admin/src/app/feature-modules/community-groups/components/communities/community/community.component';
import { CommunityGroupDetailsResolver } from 'apps/commudle-admin/src/app/feature-modules/community-groups/Resolver/community-group-details.resolver';

const routes = [
  {
    path: 'create',
    component: CommunityGroupFormComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRoles: [EUserRoles.COMMUNITY_ADMIN],
    },
  },
  {
    path: ':community_group_id',
    canActivate: [AuthGuard],
    data: {
      expectedRoles: [EUserRoles.COMMUNITY_ADMIN],
    },
    resolve: {
      community_group: CommunityGroupDetailsResolver,
    },
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: CommunitiesComponent,
        children: [
          {
            path: '',
            component: CommunityComponent,
          },
          {
            path: 'events',
            component: EventsComponent,
          },
          {
            path: 'channels',
            component: ChannelsComponent,
          },
        ],
      },
      {
        path: 'admin-team',
        component: AdminTeamComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRoles: [EUserRoles.COMMUNITY_ADMIN],
        },
      },
      {
        path: 'edit',
        component: CommunityGroupFormComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRoles: [EUserRoles.COMMUNITY_ADMIN],
        },
      },
      {
        path: 'members',
        component: MembersListComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRoles: [EUserRoles.COMMUNITY_ADMIN],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityGroupsRoutingModule {}
