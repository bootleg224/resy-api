import type { Dayjs } from "dayjs";

export interface FindResponse {
  query: Query;
  bookmark: null;
  results: Results;
}

export interface Query {
  day: Date;
  party_size: number;
}

export interface Results {
  venues: VenueElement[];
  meta: ResultsMeta;
}

export interface ResultsMeta {
  offset: number;
  limit: null;
}

export interface VenueElement {
  venue: VenueVenue;
  templates: { [key: string]: Template };
  slots: Slot[];
  notifies: any[];
  pickups: Pickups;
}

export interface Pickups {
  slots: any[];
  service_types?: unknown;
}

export interface Slot {
  availability: Availability;
  config: Config;
  date: SlotDate;
  exclusive: Availability;
  is_global_dining_access: boolean;
  floorplan: Availability;
  id: null;
  market: Market;
  meta: SlotMeta;
  lock: null;
  pacing: Pacing;
  score: Score;
  shift: Shift;
  size: SlotSize;
  status: Availability;
  table: Table;
  template: Availability;
  time: Time;
  quantity: number;
  display_config: DisplayConfig;
  reservation_config: SlotReservationConfig;
  gdc_perk: null;
  payment: Payment;
}

export interface EnhancedSlot extends Slot {
  start?: Dayjs;
  diff: number;
}

export interface Availability {
  id: number;
}

export interface Config {
  id: number;
  type: Type;
  token: string;
}

export enum Type {
  BarTable = "Bar Table",
  Cafe = "Cafe",
  DiningRoom = "Dining Room",
  Patio = "Patio",
}

export interface SlotDate {
  end: string;
  start: string;
}

export interface DisplayConfig {
  color: Color;
}

export interface Color {
  background: null;
  font: null;
}

export interface Market {
  date: MarketDate;
}

export interface MarketDate {
  off: number;
  on: number;
}

export interface SlotMeta {
  size: MetaSize;
  type: Availability;
}

export interface MetaSize {
  assumed: number;
}

export interface Pacing {
  beyond: boolean;
}

export interface Payment {
  is_paid: boolean;
  cancellation_fee: number;
  deposit_fee: null;
  service_charge: null;
  venue_share: null;
  payment_structure: null;
  secs_cancel_cut_off: number;
  time_cancel_cut_off: null;
  secs_change_cut_off: number;
  time_change_cut_off: null;
  service_charge_options: any[];
}

export interface SlotReservationConfig {
  badge: null;
}

export interface Score {
  total: number;
}

export interface Shift {
  id: number;
  service: Inventory;
  day: string;
}

export interface Inventory {
  type: Availability;
}

export interface SlotSize {
  max: number | null;
  min: number;
}

export interface Table {
  id: number[];
}

export interface Time {
  turn: Turn;
}

export interface Turn {
  actual: number;
  estimated: number;
}

export interface Template {
  is_paid: boolean;
  venue_share: null;
  restriction_id: null;
  payment_structure: null;
  cancellation_fee: number | null;
  secs_cancel_cut_off: number | null;
  time_cancel_cut_off: null;
  secs_change_cut_off: number | null;
  time_change_cut_off: null;
  large_party_size_cancel: null;
  large_party_cancellation_fee: null;
  large_party_secs_cancel_cut_off: null;
  large_party_time_cancel_cut_off: null;
  large_party_secs_change_cut_off: null;
  large_party_time_change_cut_off: null;
  deposit_fee: null;
  service_charge: null;
  service_charge_options: any[];
  images: string[];
  raw_image_names: string[];
  image_dimensions: Array<number[]>;
  is_default: number;
  is_event: number;
  is_pickup: number;
  pickup_highlight: number;
  venue_id: number;
  reservation_config: TemplateReservationConfig;
  turn_times: TurnTime[];
  display_config: DisplayConfig;
  content: TemplateContent;
  id: number;
  menu: Menu;
  name: string;
  item_ids: any[];
  menu_ids: any[];
}

export interface TemplateContent {
  "en-us": EnUs;
}

export interface EnUs {
  about: About;
}

export interface About {
  attribution: null;
  body: string;
  title: null;
}

export interface Menu {
  "en-us": string[];
}

export interface TemplateReservationConfig {
  badge: null;
  type: string;
  secs_off_market: number | null;
  time_off_market: null;
}

export interface TurnTime {
  secs_amount: number;
  size: SlotSize;
}

export interface VenueVenue {
  id: ID;
  venue_group: VenueGroup;
  name: string;
  type: string;
  url_slug: string;
  price_range: number;
  average_bill_size: number;
  currency_symbol: string;
  hospitality_included: number;
  resy_select: number;
  is_gdc: number;
  is_global_dining_access: boolean;
  is_global_dining_access_only: boolean;
  requires_reservation_transfers: number;
  is_gns: number;
  transaction_processor: string;
  hide_allergy_question: boolean;
  hide_occasion_question: boolean;
  hide_special_request_question: boolean;
  gda_concierge_booking: boolean;
  tax_included: boolean;
  rating: number;
  total_ratings: number;
  inventory: Inventory;
  reopen: Reopen;
  location: Location;
  travel_time: TravelTime;
  source: Source;
  service_types: VenueServiceTypes;
  top: boolean;
  ticket: Ticket;
  currency: Currency;
  is_rga: boolean;
  is_rga_only: boolean;
  default_template: string;
  responsive_images: ResponsiveImages;
  notify_options: NotifyOption[];
  favorite: boolean;
  waitlist: Waitlist;
  supports_pickups: number;
  collections: Collection[];
  content: ContentElement[];
  allow_bypass_payment_method: number;
  events: any[];
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

export interface ContentElement {
  attribution: null;
  body: string;
  display: Display;
  icon: Icon;
  locale: Locale;
  name: string;
  title: null;
}

export interface Display {
  type: string;
}

export interface Icon {
  url: string;
}

export interface Locale {
  language: string;
}

export interface Currency {
  symbol: string;
  code: string;
}

export interface ID {
  resy: number;
}

export interface Location {
  time_zone: string;
  neighborhood: string;
  geo: Geo;
  code: string;
  name: string;
}

export interface Geo {
  lat: number;
  lon: number;
}

export interface NotifyOption {
  service_type_id: number;
  min_request_datetime: Date;
  max_request_datetime: Date;
  step_minutes: number;
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

export interface The169 {
  "400": string;
}

export interface UrlsByResolution {
  "1:1": string;
  "4:3"?: string;
  "16:9"?: string;
}

export interface VenueServiceTypes {
  "2": unknown;
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

export interface TravelTime {
  distance: number;
}

export interface VenueGroup {
  id: number;
  name: string;
  venues: any[];
}

export interface Waitlist {
  available: number;
  label: string;
  current: null;
}
