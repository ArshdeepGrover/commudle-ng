import { Injectable } from '@angular/core';
import { ApiRoutesService } from 'projects/shared-services/api-routes.service';
import { API_ROUTES } from 'projects/shared-services/api-routes.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotifications } from 'projects/shared-models/notifications.model';
import { ENotificationStatus } from 'projects/shared-models/enums/notification_status.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private apiRoutesService: ApiRoutesService, private http: HttpClient) {}

  getAllNotifications(page, count): Observable<INotifications> {
    const params = new HttpParams().set('page', page).set('count', count);
    return this.http.get<INotifications>(this.apiRoutesService.getRoute(API_ROUTES.NOTIFICATIONS.INDEX), { params });
  }

  updateNotificationStatus(status: ENotificationStatus, id: string) {
    const params = new HttpParams().set('notification_queue_id', id);
    return this.http.post<boolean>(
      this.apiRoutesService.getRoute(API_ROUTES.NOTIFICATIONS.UPDATE_STATUS),
      { status },
      { params },
    );
  }
}
