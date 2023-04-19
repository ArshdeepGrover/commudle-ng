import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomMention } from '@commudle/editor';
import { length, required, whitespace } from '@commudle/shared-validators';
import { faGrin } from '@fortawesome/free-regular-svg-icons';
import { Editor } from '@tiptap/core';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { UserMessagesService } from 'apps/commudle-admin/src/app/services/user-messages.service';
import { DiscussionChatChannel } from 'apps/shared-components/services/websockets/discussion-chat.channel';
import { ICurrentUser } from 'apps/shared-models/current_user.model';
import { IDiscussion } from 'apps/shared-models/discussion.model';
import { IUserMessage } from 'apps/shared-models/user_message.model';
import { LibAuthwatchService } from 'apps/shared-services/lib-authwatch.service';
import { LibToastLogService } from 'apps/shared-services/lib-toastlog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() discussion: IDiscussion;
  @Output() newMessage: EventEmitter<any> = new EventEmitter<any>();

  currentUser: ICurrentUser;

  allActions;
  permittedActions = [];

  messages: IUserMessage[] = [];
  page = 1;
  count = 10;
  isLoadingMessages = true;
  showMessagesLoader = true;
  showEmojiPicker = false;

  faGrin = faGrin;

  messageForm;

  editor: Editor;

  @ViewChild('messageInput') messageInputRef: ElementRef<HTMLInputElement>;

  subscriptions: Subscription[] = [];

  constructor(
    private libAuthwatchService: LibAuthwatchService,
    private discussionChatChannel: DiscussionChatChannel,
    private libToastLogService: LibToastLogService,
    private userMessagesService: UserMessagesService,
    private fb: FormBuilder,
    private router: Router,
    private injector: Injector,
  ) {
    this.editor = new Editor({
      extensions: [Document, Text, Paragraph, CharacterCount, CustomMention(injector)],
    });

    this.messageForm = this.fb.group(
      {
        content: [''],
      },
      {
        validators: [required(this.editor), length(this.editor, 1, 200), whitespace(this.editor)],
      },
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(this.libAuthwatchService.currentUser$.subscribe((value) => (this.currentUser = value)));
    this.discussionChatChannel.subscribe(`${this.discussion.id}`);
    this.allActions = this.discussionChatChannel.ACTIONS;
    this.receiveData();
    this.getDiscussionMessages();
  }

  ngOnDestroy(): void {
    this.discussionChatChannel.unsubscribe();
    this.subscriptions.forEach((value) => value.unsubscribe());
    this.editor.destroy();
  }

  receiveData(): void {
    this.subscriptions.push(
      this.discussionChatChannel.channelData$.subscribe((value) => {
        if (value) {
          switch (value.action) {
            case this.discussionChatChannel.ACTIONS.SET_PERMISSIONS:
              this.permittedActions = value.permitted_actions;
              if (this.permittedActions.includes(this.discussionChatChannel.ACTIONS.BLOCKED)) {
                this.messageForm.disable();
              }
              break;
            case this.discussionChatChannel.ACTIONS.ADD:
              this.messages.push(value.user_message);
              this.newMessage.emit();
              break;
            case this.discussionChatChannel.ACTIONS.REPLY:
              this.messages[this.findMessageIndex(value.parent_id)].user_messages.push(value.user_message);
              this.newMessage.emit();
              break;
            case this.discussionChatChannel.ACTIONS.DELETE_ANY:
            case this.discussionChatChannel.ACTIONS.DELETE_SELF:
              if (value.parent_type === 'Discussion') {
                this.messages.splice(this.findMessageIndex(value.user_message_id), 1);
              } else {
                const qi = this.findMessageIndex(value.parent_id);
                this.messages[qi].user_messages.splice(this.findReplyIndex(qi, value.user_message_id), 1);
              }
              break;
            case this.discussionChatChannel.ACTIONS.FLAG:
              if (value.parent_type === 'Discussion') {
                this.messages[this.findMessageIndex(value.user_message_id)].flags_count += value.flag;
              } else {
                const qi = this.findMessageIndex(value.parent_id);
                this.messages[qi].user_messages[this.findReplyIndex(qi, value.user_message_id)].flags_count +=
                  value.flag;
              }
              break;
            case this.discussionChatChannel.ACTIONS.ERROR:
              this.libToastLogService.warningDialog(value.message, 2000);
              break;
          }
        }
      }),
    );
  }

  findMessageIndex(userMessageId) {
    return this.messages.findIndex((q) => q.id === userMessageId);
  }

  findReplyIndex(questionIndex, replyId) {
    return this.messages[questionIndex].user_messages.findIndex((q) => q.id === replyId);
  }

  getDiscussionMessages(): void {
    if (this.isLoadingMessages) {
      this.subscriptions.push(
        this.userMessagesService
          .pGetDiscussionChatMessages(this.discussion.id, this.page, this.count)
          .subscribe((value) => {
            if (value.user_messages.length !== this.count) {
              this.isLoadingMessages = false;
              this.showMessagesLoader = false;
            }
            this.messages.unshift(...value.user_messages.reverse());
            this.page++;
          }),
      );
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      const messageContent = this.messageForm.value;
      this.discussionChatChannel.sendData(this.discussionChatChannel.ACTIONS.ADD, { user_message: messageContent });
      this.messageForm.reset();
      this.messageForm.updateValueAndValidity();
      this.showEmojiPicker = false;
    }
  }

  sendReply(value): void {
    const messageId = value[0];
    const replyContent = value[1];
    this.discussionChatChannel.sendData(this.discussionChatChannel.ACTIONS.REPLY, {
      user_message_id: messageId,
      reply_message: replyContent,
    });
  }

  sendFlag(messageId: number): void {
    this.discussionChatChannel.sendData(this.discussionChatChannel.ACTIONS.FLAG, { user_message_id: messageId });
  }

  sendDelete({ messageId, isSelfMessage }): void {
    const action = isSelfMessage
      ? this.discussionChatChannel.ACTIONS.DELETE_SELF
      : this.discussionChatChannel.ACTIONS.DELETE_ANY;
    this.discussionChatChannel.sendData(action, { user_message_id: messageId });
  }

  addEmoji(event): void {
    this.messageForm.patchValue({
      content: (this.messageForm.get('content').value || '').concat(event.emoji.native),
    });
    this.messageInputRef.nativeElement.focus();
  }

  login() {
    this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
  }
}
