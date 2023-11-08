import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailerComponent } from './emailer/emailer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbRadioModule,
  NbSelectModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbToggleModule,
  NbIconModule,
  NbCardModule,
} from '@commudle/theme';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SpeakerResourcePreviewComponent } from './speaker-resource-preview/speaker-resource-preview.component';
import { PublicCommunityModule } from 'apps/commudle-admin/src/app/feature-modules/public-community/public-community.module';
import { FeaturedCommunitiesCardComponent } from 'apps/commudle-admin/src/app/app-shared-components/featured-communities-card/featured-communities-card.component';
import { TechSessionsCardComponent } from 'apps/commudle-admin/src/app/app-shared-components/tech-sessions-card/tech-sessions-card.component';
import { EventHorizontalCardComponent } from 'apps/commudle-admin/src/app/app-shared-components/event-horizontal-card/event-horizontal-card.component';
import { TopBuildersCardComponent } from 'apps/commudle-admin/src/app/app-shared-components/top-builders-card/top-builders-card.component';
import { LabsFeaturedCardComponent } from 'apps/commudle-admin/src/app/app-shared-components/labs-featured-card/labs-featured-card.component';
import { LabsFeaturedComponent } from 'apps/commudle-admin/src/app/app-shared-components/labs-featured/labs-featured.component';
import { SurveysComponent } from 'apps/commudle-admin/src/app/app-shared-components/surveys/surveys.component';
import { SkeletonCardsComponent } from 'apps/commudle-admin/src/app/feature-modules/skeleton-screens/components/skeleton-cards/skeleton-cards.component';
import { SharedComponentsModule } from 'apps/shared-components/shared-components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { MiniUserProfileModule } from 'apps/shared-modules/mini-user-profile/mini-user-profile.module';
import { CustomPageFormComponent } from 'apps/commudle-admin/src/app/app-shared-components/custom-page/custom-page-form/custom-page-form.component';
import { NewsletterComponent } from 'apps/commudle-admin/src/app/app-shared-components/newsletter/newsletter.component';
import { NewsletterFormComponent } from 'apps/commudle-admin/src/app/app-shared-components/newsletter/newsletter-form/newsletter-form.component';

@NgModule({
  declarations: [
    EmailerComponent,
    SpeakerResourcePreviewComponent,
    SurveysComponent,
    LabsFeaturedComponent,
    CustomPageComponent,
    CustomPageFormComponent,
    NewsletterComponent,
    NewsletterFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    RouterModule,
    PublicCommunityModule,
    SharedComponentsModule,
    MiniUserProfileModule,

    //Standalone
    TechSessionsCardComponent,
    EventHorizontalCardComponent,
    FeaturedCommunitiesCardComponent,
    TopBuildersCardComponent,
    LabsFeaturedCardComponent,
    SkeletonCardsComponent,

    // Nebular
    NbRadioModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbToggleModule,
    NbIconModule,
    NbCardModule,
    NbToggleModule,
    NbIconModule,
    NbCardModule,

    //FontAwesome
    FontAwesomeModule,
  ],
  exports: [
    EmailerComponent,
    SpeakerResourcePreviewComponent,
    SurveysComponent,
    LabsFeaturedComponent,
    CustomPageComponent,
    NewsletterComponent,
    NewsletterFormComponent,
  ],
})
export class AppSharedComponentsModule {}
