export interface VenueResponse {
  announcement: null;
  reopen: Reopen;
  custom_affiliations: any[];
  collections: Collection[];
  config: Config;
  contact: Contact;
  content: Content[];
  id: ID;
  images: string[];
  map_images: MapImages;
  responsive_images: ResponsiveImages;
  inventory: Inventory;
  links: Links;
  locale: VenueResponseLocale;
  location: Location;
  custom_affiliation: CustomAffiliation;
  venue_group: VenueGroup;
  metadata: Metadata;
  name: string;
  price_range_id: number;
  currency_symbol: string;
  rater: Rater[];
  resy_select: number;
  is_gdc: number;
  is_global_dining_access: boolean;
  is_global_dining_access_only: boolean;
  gda_concierge_booking: boolean;
  is_rga: boolean;
  gdc_perk: string;
  requires_reservation_transfers: number;
  is_gns: number;
  social: Social[];
  ticket: Ticket;
  type: string;
  url_slug: string;
  favorite: boolean;
  user_login_preference: UserLoginPreference;
  source: Source;
  hide_allergy_question: boolean;
  hide_occasion_question: boolean;
  hide_special_request_question: boolean;
  tax_included: boolean;
  safety_categories: SafetyCategory[];
  safety_info_url: null;
  min_party_size: number;
  max_party_size: number;
  large_party_message: string;
  is_active: number;
}

export interface Collection {
  id: number;
  type_id: number;
  file_name: string;
  image: string;
  name: string;
  short_name: string;
  description: string;
}

export interface Config {
  allow_bypass_payment_method: number;
  allow_multiple_resys: number;
  enable_discovery: number;
  enable_invite: number;
  enable_resypay: number;
  hospitality_included: number;
}

export interface Contact {
  phone_number: string;
  url: string;
}

export interface Content {
  attribution: null;
  body: null | string;
  display: Display;
  icon: Icon;
  locale: ContentLocale | null;
  name: string;
  title: null;
}

export interface Display {
  type: string;
}

export interface Icon {
  url: null | string;
}

export interface ContentLocale {
  language: string;
}

export interface CustomAffiliation {
  id: number | null;
}

export interface ID {
  foursquare: string;
  google: string;
  resy: number;
  fb_pixel: null;
}

export interface Inventory {
  type: CustomAffiliation;
}

export interface Links {
  deep: string;
  web: string;
}

export interface VenueResponseLocale {
  currency: string;
  time_zone: string;
}

export interface Location {
  address_1: string;
  address_2: null;
  code: string;
  country: string;
  country_iso3166: string;
  cross_street_1: string;
  cross_street_2: string;
  id: number;
  latitude: number;
  locality: string;
  longitude: number;
  neighborhood: string;
  postal_code: string;
  region: string;
}

export interface MapImages {
  "222x222": The222X222;
}

export interface The222X222 {
  "15": The15;
}

export interface The15 {
  FF2500: string;
}

export interface Metadata {
  description: string;
  keywords: string[];
}

export interface Rater {
  name: string;
  scale: number;
  score: number;
  total: number;
}

export interface Reopen {
  date: Date;
}

export interface ResponsiveImages {
  originals: { [key: string]: Icon };
  urls: Urls;
  urls_by_resolution: { [key: string]: { [key: string]: UrlsByResolution } };
  file_names: string[];
  aspect_ratios: { [key: string]: { [key: string]: string } };
}

export interface Urls {
  [key: string]: {
    [key: string]: { [key: string]: string };
  };
}

export interface UrlsByResolution {
  "1:1": string;
  "4:3"?: string;
  "16:9"?: string;
}

export interface SafetyCategory {
  id: number;
  value: string;
  order_num: number;
  items: any[];
}

export interface Social {
  id: number;
  name: string;
  value: string;
}

export interface Source {
  name: null;
  logo: null;
  terms_of_service: null;
  privacy_policy: null;
}

export interface Ticket {
  average: number;
  average_str: string;
}

export interface UserLoginPreference {
  mobile_first: number;
}

export interface VenueGroup {
  id: number;
  name: string;
  venues: any[];
}
