import { BaseService } from "./BaseService";
import type { LoginResponse } from "../types/types";
import type { SearchResponse } from "../types/types";
import type { VenueResponse } from "../types/venue";
import type { FindResponse } from "../types/find";
import type { DetailsResponse } from "../types/details";
import type { ReservationResponse } from "../types/reservations";
import dayjs from "dayjs";
import type { VenueCalendarResponse } from "../types/types";
import type { GeoIpResponse } from "../types/types";
import type { UserResponse } from "../types/types";

const BASE_URL = "https://api.resy.com/";
const routes = {
  book: "/3/book",
  cancel: "/3/cancel",
  details: "/3/details",
  emailExists: "/3/auth/exists",
  favorites: "/3/favorites",
  generateClientToken: "/2/braintree/client_token/generate",
  geoip: "/3/geoip",
  login: "/3/auth/password",
  logout: "/2/user/device",
  reservations: "/3/user/reservations",
  search: "/4/find",
  user: "/2/user",
  venue: "/3/venue",
  venueCalendar: "/4/venue/calendar",
  venueSearch: "/3/venuesearch/search",
};

export interface SearchObj {
  query: string;
  geo: Geo;
}
export interface DetailsQueryObj {
  struct_items?: any[];
  config_id: string;
  commit: number; // 0 for info, 1 to try and book
  party_size?: number;
  day: string;
}

export interface BookQueryObj {
  book_token: string;
  replace?: string;
  source_id?: string;
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
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "user-agent":
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
      authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      // "User-Agent":
      //   "Resy/2.37 (com.resy.ResyApp; build:2453; iOS 15.4.1) Alamofire/5.5.0",
      "x-resy-auth-token": authToken,
      "x-resy-universal-auth": authToken,
      // 'authorization': 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      "cache-control": "no-cache",
      dnt: "1",
      origin: "https://resy.com",
      referer: "https://resy.com/",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
      "x-origin": "https://resy.com",
    };
    return loginResp;
  };

  login = async (email?: string, password?: string) => {
    const data = new URLSearchParams({
      email: email || this.email,
      password: password || this.password,
    });
    return this.post<LoginResponse>(routes.login, data.toString(), {
      headers: {
        authorization: 'ResyAPI api_key="VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5"',
      },
    });
  };

  search = async (params: {
    bookmark?: string;
    day: string;
    lat?: number;
    limit?: string;
    location?: string;
    long?: number;
    party_size?: number;
    user_lat?: number;
    user_long?: number;
    venue_id?: number;
  }) => {
    const opts = structuredClone(params);
    opts.party_size ??= 2;
    opts.lat ??= 0;
    opts.long ??= 0;
    return this.get<FindResponse>(routes.search, {
      params: opts,
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
    const params = new URLSearchParams(data as any);
    return this.post<{
      resy_token: string;
      reservation_id: number;
    }>(routes.book, params, {
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
  getUser = async () => {
    return this.get<UserResponse>(routes.user, {
      headers: this.headers,
    });
  };

  getVenueCalendar = async (venueId: number, numSeats = 2) => {
    const startDate = dayjs().format("YYYY-MM-DD");
    const endDate = dayjs().add(1, "y").format("YYYY-MM-DD");
    const params = {
      venue_id: venueId,
      num_seats: numSeats,
      start_date: startDate,
      end_date: endDate,
    };
    return this.get<VenueCalendarResponse>(routes.venueCalendar, {
      params,
      headers: this.headers,
    });
  };

  getAvailableDatesForVenue = async (venueId: number, numSeats = 2) => {
    const venueCalendar = await this.getVenueCalendar(venueId, numSeats);

    const schedule = venueCalendar.data?.scheduled || [];
    const availableDates = schedule.filter(
      (l) => l?.inventory?.reservation === "available"
    );

    return availableDates;
  };

  getAvailableTimesForVenueAndDate = async (
    venueId: number,
    date: string,
    numSeats = 2
  ) => {
    const venueSearch = await this.search({
      venue_id: venueId,
      day: date,
      party_size: numSeats,
    });
    const slots = venueSearch.data.results?.venues?.[0].slots || [];
    return slots as FindResponse["results"]["venues"][number]["slots"];
  };

  getReservationByToken = async (resy_token: string) => {
    return this.get<ReservationResponse>(routes.reservations, {
      params: {
        resy_token,
      },
      headers: this.headers,
    });
  };

  getGeoIpData = async () => {
    return this.get<GeoIpResponse>(routes.geoip, {
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
