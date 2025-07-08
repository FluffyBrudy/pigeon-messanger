export enum API {
  ROOT = "/api",
}

export enum AUTH {
  ROOT = "/auth",
  REGISTER = "/register",
  LOGIN = "/login",
}

export enum SOCIAL {
  ROOT = "/social",
  FRIENDS_SEARCH = "/friends/search",
  FRIEND_REQUEST = "/friends/requests",
  PENDING_REQUESTS = "/friends/requests/pending",
  ACCEPTED_REQUESTS = "/friends/requests/accepted",
  ACCEPT_REQUEST = "/friends/requests/accept",
  REJECT_REQUEST = "/friends/requests/reject",
  FRIEND_SUGGESTION = "/friends/suggestion/",
  FRIEND_STATUS = "/friends/status"
}

export enum CHAT {
  ROOT = "/chat",
  MESSAGE_CREATE = "/message/create",
  MESSAGE_FETCH = "/message/fetch",
  MESSAGE_SINGLE = "/message/fetch/latest",
}

export enum PREFERENCE {
  ROOT = "/preference",
  PREF_PROFILE_DATA_FETCH = "/profile",
  PREF_BIO_UPDATE = "/profile/bio/update",
  PREF_PROFILE_SIGNATURE = "/profile/signature",
  PREF_PROFILE_IMAGE = "/profile/image",
}

export enum SILENT {
  ROOT = "/silent",
  LOGIN = "/login",
}
