import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IDiscountCode } from '@commudle/shared-models';
import { DiscountCodesService, ToastrService } from '@commudle/shared-services';
import { NbDialogService } from '@commudle/theme';
import { EventDataFormEntityGroupsService } from 'apps/commudle-admin/src/app/services/event-data-form-entity-groups.service';
import { IEventDataFormEntityGroup } from 'apps/shared-models/event_data_form_enity_group.model';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { faCopy, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'commudle-discount-coupons',
  templateUrl: './discount-coupons.component.html',
  styleUrls: ['./discount-coupons.component.scss'],
})
export class DiscountCouponsComponent implements OnInit {
  @Input() event;
  discountCodes: IDiscountCode[];
  eventDataFormEntityGroups: IEventDataFormEntityGroup[] = [];
  discountCouponForm;
  subscriptions: Subscription[] = [];
  selectedEventDataFormEntityGroups = [];

  icons = {
    faCopy,
    faPenToSquare,
  };
  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private eventDataFormEntityGroupsService: EventDataFormEntityGroupsService,
    private discountCodesService: DiscountCodesService,
    private datePipe: DatePipe,
    private clipboard: Clipboard,
    private toastrService: ToastrService,
  ) {
    this.discountCouponForm = this.fb.group(
      {
        discount_code: this.fb.group<unknown>({
          code: ['', Validators.required],
          discount_type: ['', Validators.required],
          discount_value: ['', Validators.required],
          is_limited: [false, Validators.required],
          max_limit: [0],
          expires_at: ['', Validators.required],
        }),
      },
      {
        validators: [
          // if is_limited is true, then max_limit is required
          (fb) =>
            fb.get('discount_code').get('is_limited').value === true && !fb.get('discount_code').get('max_limit').value
              ? { max_limit: true }
              : null,
        ],
      },
    );
  }

  ngOnInit(): void {
    this.getDiscountCoupons();
    this.fetchEventDataFormEntityGroups();
  }

  getDiscountCoupons() {
    this.subscriptions.push(
      this.discountCodesService.indexDiscountCodes(this.event.id).subscribe((data) => {
        this.discountCodes = data;
      }),
    );
  }

  fetchEventDataFormEntityGroups() {
    this.subscriptions.push(
      this.eventDataFormEntityGroupsService.getEventDataFormEntityGroups(this.event.id).subscribe((data) => {
        this.eventDataFormEntityGroups = data.event_data_form_entity_groups;
      }),
    );
  }

  open(dialog: TemplateRef<any>, discountCode?) {
    this.selectedEventDataFormEntityGroups = [];
    if (discountCode) {
      const date = new Date(discountCode.expires_at);
      for (const code of discountCode.event_data_form_entity_group_ids) {
        this.addEventDataForm(code, 'edit');
      }
      this.discountCouponForm.get('discount_code').setValue({
        code: discountCode.code,
        discount_type: discountCode.discount_type,
        discount_value: discountCode.discount_value,
        is_limited: true,
        max_limit: discountCode.max_limit,
        expires_at: this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss'),
      });
    }
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      autoFocus: true,
      hasScroll: false,
      context: { type: discountCode ? 'edit' : 'create', id: discountCode?.id },
    });
  }

  create() {
    const formData: any = new FormData();
    const discountCodeFormData = this.discountCouponForm.get('discount_code').value;

    Object.keys(discountCodeFormData).forEach((key) =>
      !(discountCodeFormData[key] == null) ? formData.append(`discount_code[${key}]`, discountCodeFormData[key]) : '',
    );

    this.selectedEventDataFormEntityGroups.forEach((value) =>
      formData.append('discount_code[event_data_form_entity_group_ids][]', value),
    );

    this.subscriptions.push(
      this.discountCodesService.createDiscountCode(formData, this.event.id).subscribe((data) => {
        this.discountCouponForm.reset();
        this.discountCodes.unshift(data);
      }),
    );
  }

  update(discountCodeId) {
    const formData: any = new FormData();
    const discountCodeFormData = this.discountCouponForm.get('discount_code').value;

    Object.keys(discountCodeFormData).forEach((key) =>
      !(discountCodeFormData[key] == null) ? formData.append(`discount_code[${key}]`, discountCodeFormData[key]) : '',
    );

    this.selectedEventDataFormEntityGroups.forEach((value) =>
      formData.append('discount_code[event_data_form_entity_group_ids][]', value),
    );

    this.subscriptions.push(
      this.discountCodesService.updateDiscountCodes(formData, discountCodeId).subscribe((data) => {
        const indexToUpdate = this.discountCodes.findIndex((code) => code.id === data.id);
        if (indexToUpdate !== -1) {
          this.discountCodes[indexToUpdate] = data;
        }
      }),
    );
  }

  addEventDataForm(event, formType?) {
    if (formType) {
      const id = event;
      const index = this.selectedEventDataFormEntityGroups.indexOf(id);
      this.selectedEventDataFormEntityGroups.push(id);
      console.log('called');
    } else {
      const id = event.target.value;
      const index = this.selectedEventDataFormEntityGroups.indexOf(id);
      if (event.target.checked) {
        this.selectedEventDataFormEntityGroups.push(id);
      } else if (!event.target.checked) {
        this.selectedEventDataFormEntityGroups.splice(index, 1);
      }
    }
  }

  copyTextToClipboard(code) {
    this.toastrService.successDialog('Your Code ready to paste');
    this.clipboard.copy(code);
  }
}