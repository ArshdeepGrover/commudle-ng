import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { IColumnType, Settings } from 'angular2-smart-table';
import { DataFormsService } from 'apps/commudle-admin/src/app/services/data_forms.service';
import { IDataForm } from 'apps/shared-models/data_form.model';
import { CommunityFormsListActionsComponent } from './community-forms-list-actions/community-forms-list-actions.component';
import { CommunityFormsListStatsComponent } from './community-forms-list-stats/community-forms-list-stats.component';

@Component({
  selector: 'app-community-forms-list',
  templateUrl: './community-forms-list.component.html',
  styleUrls: ['./community-forms-list.component.scss'],
})
export class CommunityFormsListComponent implements OnInit {
  faPlusSquare = faPlusSquare;
  newFormParentId;
  dataForms: IDataForm[];
  isLoading = true;
  tableSettings: Settings = {
    actions: false,
    pager: {
      perPage: 10,
    },
    columns: {
      name: {
        title: 'Name',
      },
      mini_stats: {
        title: 'Mini Stats',
        filter: false,
        type: IColumnType.Custom,
        renderComponent: CommunityFormsListStatsComponent,
        isSortable: false,
      },
      actions: {
        title: 'Actions',
        filter: false,
        type: IColumnType.Custom,
        renderComponent: CommunityFormsListActionsComponent,
        isSortable: false,
      },
    },
  };

  constructor(private dataFormsService: DataFormsService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.newFormParentId = this.activatedRoute.parent.snapshot.params['community_id'];
      this.getDataForms();
    });
  }

  getDataForms() {
    this.dataFormsService.getCommunityDataForms(this.newFormParentId).subscribe((data) => {
      this.dataForms = data.data_forms;
      this.isLoading = false;
    });
  }
}
