/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@commudle/theme';
import { CommunitiesService } from 'apps/commudle-admin/src/app/services/communities.service';
import { DataFormEntitiesService } from 'apps/commudle-admin/src/app/services/data-form-entities.service';
import { DataFormEntityResponsesService } from 'apps/commudle-admin/src/app/services/data-form-entity-responses.service';
import { EventsService } from 'apps/commudle-admin/src/app/services/events.service';
import { LibErrorHandlerService } from 'apps/lib-error-handler/src/public-api';
import { ICommunity } from 'apps/shared-models/community.model';
import { ICurrentUser } from 'apps/shared-models/current_user.model';
import { IDataFormEntity } from 'apps/shared-models/data_form_entity.model';
import { IEvent } from 'apps/shared-models/event.model';
import { LibAuthwatchService } from 'apps/shared-services/lib-authwatch.service';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import { SeoService } from 'apps/shared-services/seo.service';
import { Subscription } from 'rxjs';
import { GoogleTagManagerService } from 'apps/commudle-admin/src/app/services/google-tag-manager.service';
import {
  EventTicketOrderService,
  PaymentSettingService,
  StripeHandlerService,
  countries_details,
} from '@commudle/shared-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
@Component({
  selector: 'commudle-fill-data-form-paid',
  templateUrl: './fill-data-form-paid.component.html',
  styleUrls: ['./fill-data-form-paid.component.scss'],
})
export class FillDataFormPaidComponent implements OnInit, OnDestroy {
  countries = countries_details; //list of country code for phone numbers codes
  dataFormEntity: IDataFormEntity;
  formClosed = false; //form is closed or open for filling state
  showProfileForm = false; //if profile was not completed
  redirectRoute: any;
  event: IEvent;
  community: ICommunity;
  selectedFormResponse: any;
  currentUser: ICurrentUser;
  dialogRef: NbDialogRef<any>;

  existingResponses;

  subscriptions: Subscription[] = [];
  gtmData: any = {};
  selectedUsers = []; //store additional user information
  paymentDetails; //store payments details
  formData = new FormData();
  forms: FormGroup[] = []; // Store multiple additional user forms

  isFormDirty: boolean[] = [];
  @ViewChild('paymentDialog', { static: true }) paymentDialog: TemplateRef<any>;

  @ViewChild('formConfirmationDialog', { static: true }) formConfirmationDialog: TemplateRef<any>;

  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: 'Inter',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  // stripeTest: FormGroup;
  paymentElementForm: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataFormEntitiesService: DataFormEntitiesService,
    private eventsService: EventsService,
    private communitiesService: CommunitiesService,
    private router: Router,
    private seoService: SeoService,
    private errorHandler: LibErrorHandlerService,
    private dataFormEntityResponsesService: DataFormEntityResponsesService,
    private toastLogService: LibToastLogService,
    private dialogService: NbDialogService,
    private authWatchService: LibAuthwatchService,
    private gtm: GoogleTagManagerService,
    private paymentSettingService: PaymentSettingService,
    private fb: FormBuilder,
    private eventTicketOrderService: EventTicketOrderService,
    private stripeHandlerService: StripeHandlerService,
    private stripeService: StripeService,
  ) {
    // this.stripeTest = this.fb.group({
    //   name: ['', [Validators.required]],
    // });

    this.paymentElementForm = this.fb.group({
      name: ['John doe', [Validators.required]],
      email: ['support@ngx-stripe.dev', [Validators.required]],
      address: [''],
      zipcode: [''],
      city: [''],
      amount: [2500, [Validators.required, Validators.pattern(/d+/)]],
    });
  }

  ngOnInit() {
    this.fetchDataFormEntity();
    this.setRedirect();
    this.setupCurrentUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.dialogRef?.close();
  }

  //fetch current user details
  setupCurrentUser() {
    this.subscriptions.push(
      this.authWatchService.currentUser$.subscribe((data) => {
        this.currentUser = data;
        if (this.currentUser) {
          this.createCurrentUserForm();
          this.gtmData.com_user_id = this.currentUser.id;
        }
      }),
    );
  }

  setRedirect() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((data) => {
        if (data.next) {
          this.redirectRoute = [decodeURIComponent(data.next)];
        }
      }),
    );
  }

  fetchDataFormEntity() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        this.getDataFormEntity(params.data_form_entity_id);
      }),
    );
  }

  // prefilled form for current user
  createCurrentUserForm() {
    this.addNewUser();
    this.forms[0].patchValue({
      additional_users: {
        name: this.currentUser.name,
        email: this.currentUser.email,
        phone_country_code: '91',
        phone_number: '9501199820',
      },
    });
    this.saveUserDetails(0);
  }

  // fetch form questions
  getDataFormEntity(dataFormEntityId) {
    this.subscriptions.push(
      this.dataFormEntitiesService.getDataFormEntity(dataFormEntityId).subscribe((data) => {
        this.dataFormEntity = data;
        this.fetchPaidTicketingData(this.dataFormEntity.entity_id);
        this.gtmData.com_form_parent_type = this.dataFormEntity.entity_type;
        this.seoService.setTags(
          `${this.dataFormEntity.name}`,
          `Fill the form for ${this.dataFormEntity.name}`,
          'https://commudle.com/assets/images/commudle-logo192.png',
        );
        this.formClosed = !this.dataFormEntity.user_can_fill_form;
        if (!this.formClosed) {
          this.getExistingResponses();
          this.getParent();
        }
      }),
    );
  }

  //Fetch ticket Details
  fetchPaidTicketingData(edfegId) {
    this.subscriptions.push(
      this.paymentSettingService.indexPaymentSettings(edfegId).subscribe((data) => {
        this.paymentDetails = data;
      }),
    );
  }

  // Fetch preExisting form response
  getExistingResponses() {
    this.subscriptions.push(
      this.dataFormEntityResponsesService.getExistingResponse(this.dataFormEntity.id).subscribe((data) => {
        this.existingResponses = data.existing_responses;

        if (!this.dataFormEntity.multi_response && this.existingResponses.length >= 1) {
          this.selectedFormResponse = this.existingResponses[this.existingResponses.length - 1];
        }
      }),
    );
  }

  //get form entityType
  getParent() {
    switch (this.dataFormEntity.redirectable_entity_type) {
      case 'Event':
        this.getEvent();
        break;
      case 'AdminSurvey':
        this.showProfileForm = false;
        // nothing need to be done here
        break;
      case 'Survey':
        this.showProfileForm = false;
        // nothing need to be done here
        break;
      default:
        this.errorHandler.handleError(404, 'You cannot fill this form');
    }
  }

  //Fetch event details
  getEvent() {
    this.subscriptions.push(
      this.eventsService.pGetEvent(this.dataFormEntity.redirectable_entity_id).subscribe((data) => {
        this.event = data;
        this.gtmData.com_event_name = this.event.name;
        this.seoService.setTitle(`${this.dataFormEntity.name} | ${this.event.name}`);
        this.getCommunity(this.event.kommunity_id);

        if (this.event.header_image_path) {
          this.seoService.setTag('og:image', this.event.header_image_path);
        }
      }),
    );
  }

  //Fetch Community details
  getCommunity(communityId) {
    this.subscriptions.push(
      this.communitiesService.getCommunityDetails(communityId).subscribe((data) => {
        this.community = data;

        if (!this.event.header_image_path) {
          this.seoService.setTag('og:image', this.community.logo_path);
        }
        // if (!this.redirectRoute) {
        //   this.redirectRoute = ['/communities', this.community.slug, 'events', this.event.slug];
        // }
      }),
    );
  }

  //submit user form details
  submitForm($event) {
    this.dataFormEntityResponsesService.submitDataFormEntityResponse(this.dataFormEntity.id, $event).subscribe(() => {
      this.toastLogService.successDialog('Saved!');
      this.redirectTo();
      this.gtm.dataLayerPushEvent('submit-form', this.gtmData);
    });
  }

  redirectTo() {
    if (this.redirectRoute) {
      this.router.navigate(this.redirectRoute);
    } else {
      this.dialogRef = this.dialogService.open(this.formConfirmationDialog, { closeOnBackdropClick: false });
    }
  }

  // Generate new additional user form
  addNewUser() {
    const newForm = this.fb.group({
      additional_users: this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        phone_country_code: ['', Validators.required],
        phone_number: ['', Validators.required],
      }),
    });
    this.forms.push(newForm);
    this.isFormDirty.push(false);
    newForm.valueChanges.subscribe(() => {
      this.isFormDirty[this.forms.indexOf(newForm)] = true;
    });
  }

  //save additional user details in form for api
  saveUserDetails(index) {
    this.selectedUsers = [];
    this.selectedUsers.push(this.forms[index].value);

    this.selectedUsers.forEach((user) => {
      this.formData.append(`additional_users[][name]`, user.additional_users.name);
      this.formData.append(`additional_users[][email]`, user.additional_users.email);
      this.formData.append(`additional_users[][phone_country_code]`, '+91');
      this.formData.append(`additional_users[][phone]`, user.additional_users.phone_number);
    });
    this.isFormDirty[index] = false;
  }

  // Click for open payment box and get ticket order id
  submit() {
    this.eventTicketOrderService
      .createEventTicketOrder(this.formData, this.dataFormEntity.entity_id)
      .subscribe((data) => {
        this.elementsOptions.clientSecret =
          Object.keys(data.stripe_payment_intent.details).length !== 0
            ? data.stripe_payment_intent.details.client_secret
            : 'pi_3Nfd2wSAaAm97Wzm0H62pkAC_secret_4BuJhyqMyhM6MrcMnjU6uWzXg';
        this.dialogRef = this.dialogService.open(this.paymentDialog, { closeOnBackdropClick: false });
      });
  }

  // for Payment confirm Function
  payNPM(): void {
    //  if (this.paymentElementForm.valid) {
    this.stripeService
      .confirmPayment({
        elements: this.paymentElement.elements,
        redirect: 'if_required',
      })
      .subscribe((result) => {
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
  }
}