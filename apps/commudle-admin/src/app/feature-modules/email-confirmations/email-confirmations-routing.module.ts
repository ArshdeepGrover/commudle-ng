import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'apps/shared-services/lib-authwatch.guard';
import { CollaborationCommunityComponent } from './components/collaboration-community/collaboration-community.component';
import { EmailUnsubscribeComponent } from './components/email-unsubscribe/email-unsubscribe.component';
import { RsvpComponent } from './components/rsvp/rsvp.component';
import { UserRoleConfirmationComponent } from './components/user-role-confirmation/user-role-confirmation.component';
import { HackathonJudgeConfirmationComponent } from './components/hackathon-judge-confirmation/hackathon-judge-confirmation.component';
import { HackathonTeamConfirmationComponent } from './components/hackathon-team-confirmation/hackathon-team-confirmation.component';

const routes = [
  {
    path: 'event-rsvp',
    component: RsvpComponent,
  },
  {
    path: 'collaboration-community',
    component: CollaborationCommunityComponent,
  },
  {
    path: 'user-role',
    component: UserRoleConfirmationComponent,
  },
  {
    path: 'hackathon-judge',
    component: HackathonJudgeConfirmationComponent,
  },
  {
    path: 'hackathon-team',
    component: HackathonTeamConfirmationComponent,
  },
  {
    path: 'subscription/:eug',
    component: EmailUnsubscribeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConfirmationsRoutingModule {}
