import { Component, OnInit } from '@angular/core';
import { NbWindowService } from '@commudle/theme';
import { AdminSurveysService } from 'apps/commudle-admin/src/app/feature-modules/sys-admin/services/admin-surveys.service';
import { FormResponsesComponent } from 'apps/shared-components/form-responses/form-responses.component';
import { ESurveyStatus, ISurvey } from 'apps/shared-models/survey.model';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import { SeoService } from 'apps/shared-services/seo.service';

@Component({
  selector: 'app-admin-surveys',
  templateUrl: './admin-surveys.component.html',
  styleUrls: ['./admin-surveys.component.scss'],
})
export class AdminSurveysComponent implements OnInit {
  adminSurveys: ISurvey[];
  EAdminSurveyStatus = ESurveyStatus;

  constructor(
    private adminSurveysService: AdminSurveysService,
    private windowService: NbWindowService,
    private toastLogService: LibToastLogService,
    private seoService: SeoService,
  ) {}

  ngOnInit() {
    this.seoService.setTitle('Admin: Surveys');
    this.getSurveys();
  }

  getSurveys() {
    this.adminSurveysService.getAdminSurveys().subscribe((data) => {
      this.adminSurveys = data.admin_surveys;
    });
  }

  openResponses(survey: ISurvey) {
    this.windowService.open(FormResponsesComponent, {
      title: `Survey ${survey.name} Responses`,
      context: {
        dataFormId: survey.data_form_entity.data_form_id,
      },
      windowClass: 'full-screen-width',
    });
  }

  updateStatus(status, index) {
    status = status ? ESurveyStatus.open : ESurveyStatus.closed;
    this.adminSurveysService.updateStatus(status, this.adminSurveys[index].id).subscribe((data) => {
      this.adminSurveys[index].status = status;
      this.toastLogService.successDialog('Updated', 2000);
    });
  }

  toggleMultiResponse(index) {
    this.adminSurveysService.toggleMultiResponse(this.adminSurveys[index].id).subscribe((data) => {
      this.adminSurveys[index].multi_response = data;
      this.toastLogService.successDialog('Updated', 2000);
    });
  }
}
