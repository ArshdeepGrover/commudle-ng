import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserProfileManagerService } from 'apps/commudle-admin/src/app/feature-modules/users/services/user-profile-manager.service';
import { ICurrentUser } from 'apps/shared-models/current_user.model';
import { LibAuthwatchService } from 'apps/shared-services/lib-authwatch.service';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Output() basicInfoFormValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

  currentUser: ICurrentUser;
  uploadedProfilePicture: any;
  uploadedProfilePictureFile: File;

  faFileImage = faFileImage;

  basicInfoForm;

  constructor(
    private fb: FormBuilder,
    private authWatchService: LibAuthwatchService,
    private toastLogService: LibToastLogService,
    private userProfileManagerService: UserProfileManagerService,
  ) {
    this.basicInfoForm = this.fb.group({
      name: ['', Validators.required],
      about_me: ['', [Validators.required, Validators.maxLength(1000)]],
      designation: ['', [Validators.required, Validators.maxLength(100)]],
      location: [''],
      gender: [''],
    });
  }

  ngOnInit(): void {
    this.authWatchService.currentUser$.subscribe((currentUser) => {
      if (currentUser) {
        this.currentUser = currentUser;
        this.basicInfoForm.patchValue(this.currentUser);
        this.basicInfoFormValidity.emit(this.basicInfoForm.valid); //initial validity
        this.uploadedProfilePicture = this.currentUser.avatar;
        this.userProfileManagerService.userProfileForm.patchValue(this.basicInfoForm.value);
      }
    });

    this.basicInfoForm.valueChanges.subscribe((value) => {
      this.userProfileManagerService.userProfileForm.patchValue(value);
      this.basicInfoFormValidity.emit(this.basicInfoForm.valid); // whenever form value changes check validity
    });
  }

  displaySelectedProfileImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2425190) {
        this.toastLogService.warningDialog('Image should be less than 2 Mb', 3000);
        return;
      }
      this.uploadedProfilePictureFile = file;

      if (this.uploadedProfilePictureFile != null) {
        this.userProfileManagerService.uploadedProfilePictureFile = this.uploadedProfilePictureFile;
      }

      const reader = new FileReader();
      reader.onload = () => (this.uploadedProfilePicture = reader.result);
      reader.readAsDataURL(file);
    }
  }
}
