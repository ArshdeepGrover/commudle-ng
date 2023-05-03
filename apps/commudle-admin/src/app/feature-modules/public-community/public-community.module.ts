import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAlertModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbOptionModule,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTooltipModule,
} from '@commudle/theme';
import { SharedComponentsModule } from 'apps/shared-components/shared-components.module';
import { LinkyModule } from 'ngx-linky';
import { SharedDirectivesModule } from 'apps/shared-directives/shared-directives.module';
import { MiniUserProfileModule } from 'apps/shared-modules/mini-user-profile/mini-user-profile.module';
import { SharedPipesModule } from 'apps/shared-pipes/pipes.module';
import { AboutComponent } from './components/about/about.component';
import { CommunityChannelsListComponent } from './components/community-channels-list/community-channels-list.component';
import { EventsComponent } from './components/events/events.component';
import { HomeCommunityComponent } from './components/home-community/home-community.component';
import { MembersComponent } from './components/members/members.component';
import { MembershipToggleComponent } from './components/membership-toggle/membership-toggle.component';
import { SpeakerCardComponent } from './components/speakers/speaker-card/speaker-card.component';
import { PublicCommunityRoutingModule } from './public-community-routing.module';
import { PublicCommunityNotificationsComponent } from './components/public-community-notifications/public-community-notifications.component';
import { NotificationsModule } from 'apps/commudle-admin/src/app/feature-modules/notifications/notifications.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserConsentsComponent } from '../../app-shared-components/user-consents/user-consents.component';

@NgModule({
  declarations: [
    HomeCommunityComponent,
    AboutComponent,
    EventsComponent,
    MembersComponent,
    // EventResourcesComponent,
    MembershipToggleComponent,
    CommunityChannelsListComponent,
    SpeakerCardComponent,
    PublicCommunityNotificationsComponent,
  ],
  exports: [MembershipToggleComponent],
  imports: [
    CommonModule,
    PublicCommunityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    LinkyModule,
    MiniUserProfileModule,
    NotificationsModule,
    SharedComponentsModule,
    FontAwesomeModule,
    UserConsentsComponent,

    // Nebular
    NbCardModule,
    NbListModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbTooltipModule,
    NbPopoverModule,
    NbTabsetModule,
    NbAlertModule,
    NbBadgeModule,
    NbSelectModule,
    NbOptionModule,
    NbDialogModule.forChild(),
    NbSpinnerModule,
  ],
})
export class PublicCommunityModule {}
