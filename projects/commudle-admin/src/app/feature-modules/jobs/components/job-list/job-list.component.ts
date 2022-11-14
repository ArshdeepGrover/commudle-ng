import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { JobService } from 'projects/commudle-admin/src/app/services/job.service';
import {
  EJobCategory,
  EJobLocationType,
  EJobSalaryCurrency,
  EJobSalaryType,
  EJobStatus,
  EJobType,
  IJob,
} from 'projects/shared-models/job.model';
import { IPageInfo } from 'projects/shared-models/page-info.model';
import { Subscription } from 'rxjs';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { LibAuthwatchService } from 'projects/shared-services/lib-authwatch.service';
import { ICurrentUser } from 'projects/shared-models/current_user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: IJob[] = [];
  currentUser: ICurrentUser;
  limit = 10;
  page_info: IPageInfo;
  isLoading = false;
  faFilters = faFilter;
  formValue;

  filterForm = this.fb.group({
    category: [''],
    salary_type: [''],
    salary_currency: [''],
    location_type: [''],
    job_type: [''],
    status: [''],
    experience: [''],
    min_experience: [''],
    max_experience: '',
    salary_range: [''],
    min_salary: [''],
    max_salary: [''],
  });

  experiences = [
    { min_experience: '0', max_experience: '1', label: '0-1 Year' },
    { min_experience: '1', max_experience: '2', label: '1-2 Year' },
    { min_experience: '2', max_experience: '3', label: '2-3 Year' },
    { min_experience: '3', max_experience: '4', label: '3-4 Year' },
    { min_experience: '4', max_experience: '', label: '>4 Year' },
  ];
  salaryRange = [
    { min_salary: '0', max_salary: '25000', label: '0 to 25,000' },
    { min_salary: '25001', max_salary: '50000', label: '25,001 to 50,000' },
    { min_salary: '50001', max_salary: '100000', label: '50,001 to 1,000,00' },
    { min_salary: '100001', max_salary: '', label: 'More than 1,000,00' },
  ];

  jobCategories = Object.values(EJobCategory);
  jobSalaryTypes = Object.values(EJobSalaryType);
  jobSalaryCurrencies = Object.values(EJobSalaryCurrency);
  jobLocationTypes = Object.values(EJobLocationType);
  jobTypes = Object.values(EJobType);
  jobStatuses = Object.values(EJobStatus);

  subscriptions: Subscription[] = [];

  constructor(
    private jobService: JobService,
    private fb: FormBuilder,
    private authWatchService: LibAuthwatchService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getJobs();

    this.subscriptions.push(this.authWatchService.currentUser$.subscribe((data) => (this.currentUser = data)));

    // listen to changes in filter form
    this.subscriptions.push(
      this.filterForm.valueChanges.subscribe(() => {
        this.isLoading = true;
        this.page_info = null;
        this.formValue = {
          category: this.filterForm.value.category,
          salary_type: this.filterForm.value.salary_type,
          location_type: this.filterForm.value.location_type,
          job_type: this.filterForm.value.job_type,
          min_experience: this.filterForm.value.experience ? this.filterForm.value.experience.min : '',
          max_experience: this.filterForm.value.experience ? this.filterForm.value.experience.max : '',
          min_salary: this.filterForm.value.salary_range ? this.filterForm.value.salary_range.min : '',
          max_salary: this.filterForm.value.salary_range ? this.filterForm.value.salary_range.max : '',
          salary_currency: this.filterForm.value.salary_currency,
        };
        this.getJobs(true);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((value) => value.unsubscribe());
  }

  getJobs(clear = false) {
    this.isLoading = true;
    this.subscriptions.push(
      this.jobService
        .getJobs({
          after: this.page_info?.end_cursor,
          limit: this.limit,
          ...this.formValue,
        })
        .subscribe((data) => {
          if (clear) {
            this.jobs = [];
          }
          this.jobs = this.jobs.concat(data.page.reduce((acc, value) => [...acc, value.data], []));
          this.page_info = data.page_info;
          this.isLoading = false;
        }),
    );
  }
  reset() {
    this.filterForm.reset();
    this.formValue = {
      category: [''],
      salary_type: [''],
      salary_currency: [''],
      location_type: [''],
      job_type: [''],
      min_experience: [''],
      max_experience: '',
      min_salary: [''],
      max_salary: [''],
    };
    this.getJobs();
  }

  redirectToProfile() {
    this.router.navigate(['/users/' + this.currentUser.username], { fragment: 'jobs' });
  }
}
