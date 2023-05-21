import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserRolesUser } from 'apps/shared-models/user_roles_user.model';
import { IUserRolesUsers } from 'apps/shared-models/user_roles_users.model';
import { IUsers } from 'apps/shared-models/users.model';
import { API_ROUTES } from 'apps/shared-services/api-routes.constants';
import { ApiRoutesService } from 'apps/shared-services/api-routes.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRolesUsersService {
  constructor(private http: HttpClient, private apiRoutesService: ApiRoutesService) {}

  getCommunityUsersByRole(communityId, userRoleName): Observable<IUserRolesUsers> {
    const params = new HttpParams().set('community_id', communityId).set('user_role_name', userRoleName);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.GET_ADMIN_COMMUNITY_USERS_BY_ROLE),
      { params },
    );
  }

  getEventVolunteers(eventId): Observable<IUserRolesUsers> {
    const params = new HttpParams().set('event_id', eventId);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.GET_EVENT_VOLUNTEERS),
      { params },
    );
  }

  autocompleteRoleDesignation(query: string, community_id: number): Observable<any> {
    const params = new HttpParams().set('query', query).set('community_id', community_id);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.ROLE_DESIGNATIONS),
      { params },
    );
  }

  getCommunityGroupLeaders(communityGroupId): Observable<IUserRolesUsers> {
    const params = new HttpParams().set('community_group_id', communityGroupId);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.GET_ADMIN_COMMUNITY_GROUP_USERS),
      { params },
    );
  }

  getCommunityMembers(
    query,
    communityId,
    count,
    page,
    employer?,
    employee?,
    contentCreator?,
    speaker?,
  ): Observable<IUserRolesUsers> {
    let params = new HttpParams();
    params = params
      .set('community_id', communityId)
      .set('query', query)
      .set('count', count)
      .set('page', page)
      .set('employer', employer)
      .set('employee', employee)
      .set('content_creator', contentCreator)
      .set('speaker', speaker);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.COMMUNITY_MEMBERS),
      { params },
    );
  }

  getCommunityBlockedUsers(query, communityId, count, page): Observable<IUserRolesUsers> {
    const params = new HttpParams()
      .set('community_id', communityId)
      .set('query', query)
      .set('count', count)
      .set('page', page);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.COMMUNITY_BLOCKED_USERS),
      { params },
    );
  }

  createUserRolesUser(userRolesUserData): Observable<IUserRolesUser> {
    return this.http.post<IUserRolesUser>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.CREATE), {
      user_roles_user: userRolesUserData,
    });
  }

  addEventVolunteer(email, eventId): Observable<IUserRolesUser> {
    return this.http.post<IUserRolesUser>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.CREATE), {
      email,
      event_id: eventId,
    });
  }

  removeUserRolesUser(userRolesUserId): Observable<any> {
    const params = new HttpParams().set('user_roles_user_id', userRolesUserId);

    return this.http.delete<any>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.DELETE), { params });
  }

  resendInvitation(userRolesUserId): Observable<any> {
    const params = new HttpParams().set('user_roles_user_id', userRolesUserId);

    return this.http.get<any>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.RESEND_INVITATION), {
      params,
    });
  }

  confirmCommunityRole(token, decline): Observable<any> {
    return this.http.put<any>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.ACTIVATE_COMMUNITY_ROLE), {
      token,
      decline: decline,
    });
  }

  pGetCommunityLeadersByRole(communityId, userRoleName): Observable<IUsers> {
    const params = new HttpParams().set('community_id', communityId).set('user_role_name', userRoleName);
    return this.http.get<IUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.PUBLIC_GET_COMMUNITY_LEADERS_BY_ROLE),
      { params },
    );
  }

  pGetCommunityGroupLeaders(communityGroupId): Observable<IUserRolesUsers> {
    const params = new HttpParams().set('community_group_id', communityGroupId);
    return this.http.get<IUserRolesUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.PUBLIC_GET_ADMIN_COMMUNITY_GROUP_USERS),
      { params },
    );
  }

  pGetCommunityMembers(communityId, page, count): Observable<IUsers> {
    const params = new HttpParams().set('community_id', communityId).set('page', page).set('count', count);
    return this.http.get<IUsers>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.PUBLIC_GET_COMMUNITY_MEMBERS),
      { params },
    );
  }

  pCheckMembership(communityId): Observable<boolean> {
    const params = new HttpParams().set('community_id', communityId);
    return this.http.get<boolean>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.PUBLIC_CHECK_MEMBERSHIP), {
      params,
    });
  }

  pToggleMembership(communityId): Observable<boolean> {
    return this.http.post<boolean>(
      this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.PUBLIC_TOGGLE_MEMBERSHIP),
      {
        community_id: communityId,
      },
    );
  }

  removeUser(userRolesUserIds: Partial<{ user_roles_user_ids: unknown[] }>, communityId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.REMOVE_USER), {
      user_roles_user_ids: userRolesUserIds,
      community_id: communityId,
    });
  }

  blockUser(userId, communityId): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.BLOCK_USER), {
      user_id: userId,
      community_id: communityId,
    });
  }

  unblockUser(userId, communityId): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.UNBLOCK_USER), {
      user_id: userId,
      community_id: communityId,
    });
  }

  getRoles(userId, communityId): Observable<IUserRolesUsers> {
    const params = new HttpParams().set('user_id', userId).set('community_id', communityId);
    return this.http.get<IUserRolesUsers>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.ROLES), {
      params,
    });
  }

  verifyInvitationToken(token): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get<any>(this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.VERIFY_INVITATION_TOKEN), {
      params,
    });
  }

  // verifyInvitationToken(token): Observable<any> {
  //   const url = `${this.apiRoutesService.getRoute(API_ROUTES.USER_ROLES_USERS.VERIFY_INVITATION_TOKEN)}?token=${token}`;
  //   return this.http.get<any>(url);
  // }
}
