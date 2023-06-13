import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule,
} from '@commudle/theme';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RecommendationsModule } from 'apps/commudle-admin/src/app/feature-modules/recommendations/recommendations.module';
import { SharedComponentsModule } from 'apps/shared-components/shared-components.module';
import { SharedDirectivesModule } from 'apps/shared-directives/shared-directives.module';
import { InfiniteScrollModule } from 'apps/shared-modules/infinite-scroll/infinite-scroll.module';
import { MiniUserProfileModule } from 'apps/shared-modules/mini-user-profile/mini-user-profile.module';
import { PageAdsModule } from 'apps/shared-modules/page-ads/page-ads.module';
import { SharedPipesModule } from 'apps/shared-pipes/pipes.module';
import { CommunityBuildsRoutingModule } from './community-builds-routing.module';
import { CommunityBuildDetailsComponent } from './components/community-build/community-build-details/community-build-details.component';
import { CommunityBuildComponent } from './components/community-build/community-build.component';
import { CommunityBuildCardComponent } from './components/community-builds/community-build-card/community-build-card.component';
import { CommunityBuildsComponent } from './components/community-builds/community-builds.component';
import { CreateCommunityBuildComponent } from './components/create-community-build/create-community-build.component';
import { BuildListItemComponent } from './components/my-community-builds/build-list-item/build-list-item.component';
import { MyCommunityBuildsComponent } from './components/my-community-builds/my-community-builds.component';
import { TeammateInviteConfirmationComponent } from './components/teammate-invite-confirmation/teammate-invite-confirmation.component';
import { PublicHomeListEventsModule } from 'apps/commudle-admin/src/app/feature-modules/listing-pages/public-home-list-events/public-home-list-events.module';
import { FeaturedProjectsComponent } from './components/community-builds/featured-projects/featured-projects.component';
import { FeaturedProjectsCardComponent } from '../../app-shared-components/featured-projects-card/featured-projects-card.component';
import { BuildsHeaderComponent } from 'apps/commudle-admin/src/app/feature-modules/community-builds/components/community-builds/builds-header/builds-header.component';

@NgModule({
  declarations: [
    CreateCommunityBuildComponent,
    MyCommunityBuildsComponent,
    CommunityBuildsComponent,
    CommunityBuildDetailsComponent,
    CommunityBuildComponent,
    BuildListItemComponent,
    TeammateInviteConfirmationComponent,
    CommunityBuildCardComponent,
    FeaturedProjectsComponent,
    BuildsHeaderComponent,
  ],
  imports: [
    CommonModule,
    CommunityBuildsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    SharedComponentsModule,
    EditorModule,
    SharedPipesModule,
    SharedDirectivesModule,
    PageAdsModule,
    InfiniteScrollModule,
    RecommendationsModule,
    MiniUserProfileModule,
    PublicHomeListEventsModule,
    // Nebular
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbIconModule,
    NbPopoverModule,
    NbCheckboxModule,
    //FontAwesomeModule
    FontAwesomeModule,
    FeaturedProjectsCardComponent,
  ],
})
export class CommunityBuildsModule {}
