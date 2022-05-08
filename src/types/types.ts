export interface LoginResponse {
  id: number;
  first_name: string;
  last_name: string;
  mobile_number: string;
  em_address: string;
  profile_image_id: string;
  fb_user_id: null;
  date_fb_token_expires: null;
  twit_user_id: null;
  in_user_id: null;
  em_is_verified: number;
  mobile_number_is_verified: number;
  is_active: number;
  referral_code: string;
  date_app_first_opened: null;
  bio: null;
  is_marketable: number;
  date_of_birth: Date;
  is_concierge: number;
  date_updated: number;
  date_created: number;
  has_set_password: number;
  viewed_gda_welcome: boolean;
  num_bookings: number;
  payment_methods: PaymentMethod[];
  alternate_mobile_numbers: null;
  venue_credits: null;
  amex_card_types: any[];
  resy_select: number;
  is_global_dining_access: boolean;
  profile_image_url: string;
  payment_method_id: number;
  payment_provider_id: number;
  payment_provider_name: string;
  payment_display: string;
  is_rga: boolean;
  guest_id: number;
  token: string;
  legacy_token: string;
  refresh_token: string;
  allergies: null;
  email_opt_out: any[];
  venue_opt_in: any[];
}

export interface PaymentMethod {
  id: number;
  is_default: boolean;
  provider_id: number;
  provider_name: string;
  display: string;
  type: string;
  exp_year: number;
  exp_month: number;
  issuing_bank: string;
}

export interface SearchResponse {
  suggestions: Suggestion[];
  search: Search;
  meta: SearchResponseMeta;
}

export interface SearchResponseMeta {
  per_page: number;
  total: number;
  page: number;
  total_pages: number;
}

export interface Search {
  hits: Hit[];
  nbPages: number;
  page: number;
  hitsPerPage: number;
  nbHits: number;
}

export interface Hit {
  country: Country;
  source: Source;
  collection: string[];
  locality: LocalityEnum;
  is_rga: number;
  is_gns: number;
  name: string;
  inventory_type_id: number;
  images: string[];
  currency_symbol: CurrencySymbol;
  reopen: Reopen;
  gda_concierge_booking: boolean;
  availability: null;
  inventory_event: any[];
  content: Content[];
  neighborhood: string;
  cuisine: string[];
  objectID: string;
  is_global_dining_access: boolean;
  favorite: boolean;
  resy_select: number;
  requires_reservation_transfers: number;
  menu_highlights: string[];
  enable_for_app: number;
  cuisine_detail: string[] | null;
  region: Region;
  id: ID;
  contact: Contact;
  inventory_any: Date[];
  rating: Rating;
  location: HitLocation;
  _highlightResult: HighlightResult;
  url_slug: string;
  is_gdc: number;
  price_range_id: number;
  _geoloc: Geoloc;
  keywords: Keyword[];
  collections: Collection[];
}

export interface Geoloc {
  lat: number;
  lng: number;
}

export interface HighlightResult {
  keywords?: LocalityElement[];
  location: HighlightResultLocation;
  name: LocalityElement;
  neighborhood: LocalityElement;
  locality: LocalityElement;
  cuisine: LocalityElement[];
  cuisine_detail?: LocalityElement[];
}

export interface LocalityElement {
  value: string;
  matchLevel: MatchLevel;
  matchedWords: MatchedWord[];
  fullyHighlighted?: boolean;
}

export enum MatchLevel {
  Full = "full",
  None = "none",
}

export enum MatchedWord {
  LE = "le",
}

export interface HighlightResultLocation {
  name: LocalityElement;
}

export interface Collection {
  type_id: number;
  file_name: string;
  short_name: string;
  name: string;
  id: string;
  image: string;
}

export interface Contact {
  phone_number: string;
}

export interface Content {
  title: null;
  icon: Icon;
  attribution: null;
  locale: Locale;
  display: Display;
  name: ContentName;
  body: string;
}

export interface Display {
  type: Type;
}

export enum Type {
  Text = "text",
}

export interface Icon {
  url: string;
}

export interface Locale {
  language: Language;
}

export enum Language {
  EnUs = "en-us",
}

export enum ContentName {
  WhyWeLikeIt = "why_we_like_it",
}

export enum Country {
  UnitedStates = "United States",
}

export enum CurrencySymbol {
  Empty = "$",
}

export interface ID {
  resy: number;
}

export enum Keyword {
  Brunch = "brunch",
}

export enum LocalityEnum {
  Brooklyn = "Brooklyn",
  NewYork = "New York",
}

export interface HitLocation {
  id: number;
  name: LocationName;
  code: Code;
}

export enum Code {
  Frtl = "frtl",
  Lnx = "lnx",
  Ny = "ny",
}

export enum LocationName {
  FortLeeNJ = "Fort Lee, NJ",
  LenoxMA = "Lenox, MA",
  NewYork = "New York",
}

export interface Rating {
  average: number;
  count: number;
}

export enum Region {
  Ny = "NY",
}

export interface Reopen {
  date: Date | null;
}

export interface Source {
  privacy_policy: null;
  logo: null;
  terms_of_service: null;
  name: null;
}

export interface Suggestion {
  value: string;
  highlighted: string;
  type: string;
  meta?: SuggestionMeta;
}

export interface SuggestionMeta {
  neighborhood: string;
  locality: string;
  region: string;
  country: Country;
  location: HitLocation;
}
