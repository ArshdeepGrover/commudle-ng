import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'apps/shared-models/user.model';
import { UserChatsService } from '../../commudle-admin/src/app/feature-modules/user-chats/services/user-chats.service';

@Component({
  selector: 'app-user-profile-horizontal',
  templateUrl: './user-profile-horizontal.component.html',
  styleUrls: ['./user-profile-horizontal.component.scss'],
})
export class UserProfileHorizontalComponent implements OnInit {
  @Input() user: IUser;
  @Input() size: string;
  @Input() aboutMe: boolean;
  @Input() designation = true;
  @Input() socialMediaLinks: boolean;
  @Input() showLiveStatus: boolean;

  constructor(private userChatsService: UserChatsService) {}

  ngOnInit() {}

  openChatWithUser() {
    this.userChatsService.changeFollowerId(this.user.id);
  }
}
