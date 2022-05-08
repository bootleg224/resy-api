import { BaseService } from "./BaseService";
import type { LoginResponse } from "../types/types";
import type { SearchResponse } from "../types/types";
import type { VenueResponse } from "../types/venue";
import type { FindResponse } from "../types/find";
import type { DetailsResponse } from "../types/details";
import type { ReservationResponse } from "../types/reservations";

const BASE_URL = "https://api.resy.com/";
const routes = {
  login: "/3/auth/password",
  logout: "/2/user/device",
  emailExists: "/3/auth/exists",
  generateClientToken: "/2/braintree/client_token/generate",
  search: "/4/find",
  venueSearch: "/3/venuesearch/search",
  venue: "/3/venue",
  details: "/3/details",
  book: "/3/book",
  favorites: "/3/favorites",
  reservations: "/3/user/reservations",
  cancel: "/3/cancel",
};

export interface SearchObj {
  query: string;
  geo: Geo;
}
export interface DetailsQueryObj {
  struct_items: any[];
  config_id: string;
  commit: number; // 0 for info, 1 to try and book
}

export interface BookQueryObj {
  book_token: string;
  replace: string;
  struct_payment_method: string;
}

export interface Geo {
  longitude: number;
  latitude: number;
}

class ResyService extends BaseService {
  headers: Record<string, string> = {};

  email: string;
  password: string;

  constructor({ email, password }: { email: string; password: string }) {
    super(BASE_URL);
    this.email = email;
    this.password = password;
    this.headers = {
      Authorization: 'ResyAPI api_key="AIcdK2rLXG6TYwJseSbmrBAy3RP81ocd"',
      "User-Agent":
        "Resy/2.37 (com.resy.ResyApp; build:2453; iOS 15.4.1) Alamofire/5.5.0",
    };
  }

  logout = async (token: string) => {
    const params = new URLSearchParams();
    params.set("device_token", token);
    return this.delete(routes.logout + `?${params.toString()}`);
  };

  emailExists = async (email: string) => {
    const body = `email=${email}`;
    return this.post<{ result: boolean }>(routes.emailExists, body);
  };

  generateClientToken = async (authToken: string, apiKey: string) => {
    return this.get<{ client_token: string }>(routes.generateClientToken, {
      headers: this.headers,
    });
  };

  generateHeadersAndLogin = async () => {
    const loginResp = await this.login(this.email, this.password);
    const authToken = loginResp.data.token;
    this.headers = {
      ...this.headers,
      Authorization: 'ResyAPI api_key="AIcdK2rLXG6TYwJseSbmrBAy3RP81ocd"',
      "User-Agent":
        "Resy/2.37 (com.resy.ResyApp; build:2453; iOS 15.4.1) Alamofire/5.5.0",
      "X-Resy-Auth-Token": authToken,
      "X-Resy-Universal-Auth": authToken,
    };
    return loginResp;
  };

  login = async (email?: string, password?: string) => {
    const data = new URLSearchParams({
      email: email || this.email,
      password: password || this.password,
    });
    return this.post<LoginResponse>(routes.login, data.toString(), {
      headers: this.headers,
    });
  };

  search = async (params: {
    bookmark: string;
    day: Date;
    lat: string;
    limit: string;
    location: string;
    long: string;
    party_size: string;
    user_lat: string;
    user_long: string;
    venue_id?: string;
  }) => {
    return this.get<FindResponse>(routes.search, {
      params,
      headers: this.headers,
    });
  };

  searchByName = async (data: SearchObj) => {
    return this.post<SearchResponse>(routes.venueSearch, data, {
      headers: this.headers,
    });
  };

  details = async (data: DetailsQueryObj) => {
    return this.post<DetailsResponse>(routes.details, data, {
      headers: this.headers,
    });
  };

  book = async (data: BookQueryObj) => {
    return this.post<{
      resy_token: string;
      reservation_id: number;
    }>(routes.book, data, {
      headers: this.headers,
    });
  };

  getVenue = async (venueId: number) => {
    return this.get<VenueResponse>(routes.venue, {
      params: {
        id: venueId,
      },
      headers: this.headers,
    });
  };

  getReservationByToken = async (resy_token: string) => {
    return this.get<ReservationResponse>(routes.reservations, {
      params: {
        resy_token,
      },
      headers: this.headers,
    });
  };

  cancelReservationByToken = async (resy_token: string) => {
    const data = new URLSearchParams({
      resy_token,
    });
    return this.post<ReservationResponse>(routes.cancel, data.toString(), {
      headers: this.headers,
    });
  };
}

export default ResyService;
