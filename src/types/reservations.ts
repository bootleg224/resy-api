export interface ReservationResponse {
  reservations: Reservation[];
  venues: Venues;
  metadata: Metadata;
}

export interface Metadata {
  total: number;
  offset: number;
  limit: number;
}

export interface Reservation {
  payment_method: null;
  secs_cancel: null;
  secs_change: null;
  cancellation: Cancellation;
  change: Change;
  cancellation_policy: string[];
  config: ReservationConfig;
  day: Date;
  event: null;
  features: null;
  num_seats: number;
  occasion: null;
  special_request: null;
  payment: Payment;
  price: number;
  service_charge: string;
  template: Template;
  reservation_id: number;
  service_type_id: number;
  content: Content[];
  status: Status;
  time_slot: string;
  venue: Venue;
  is_pickup: boolean;
  rating: Rating;
  is_global_dining_access: boolean;
  exclusive_ids: null;
  add_ons_available: boolean;
  when: Date;
  resy_token: string;
  party: Party[];
  attendee: Attendee;
  share: Share;
  ticket: Ticket;
  gdc_perk: null;
  add_ons: any[];
  badge: Badge;
}

export interface Attendee {
  token: string;
  type: string;
}

export interface Badge {
  background_color: null;
  image: null;
}

export interface Cancellation {
  allowed: boolean;
  date_credit_cut_off: null;
  date_refund_cut_off: Date;
  fee: Fee;
}

export interface Fee {
  amount: null;
  applies: boolean;
  date_cut_off: Date;
  display: FeeDisplay;
}

export interface FeeDisplay {
  amount: null;
}

export interface Change {
  allowed: boolean;
  date_cut_off: Date;
}

export interface ReservationConfig {
  background_color: string;
  font_color: string;
  type: string;
}

export interface Content {
  attribution: null;
  body: null | string;
  display: ContentDisplay;
  icon: Icon;
  locale: ContentLocale | null;
  name: string;
  title: null;
}

export interface ContentDisplay {
  type: Type;
}

export enum Type {
  Text = "text",
}

export interface Icon {
  url: null | string;
}

export interface ContentLocale {
  language: string;
}

export interface Party {
  token: string;
  guest_of_token: null;
  first_name: null | string;
  last_name: null | string;
  contact: null;
  receipt: null;
  pay: null;
  user: User | null;
  label: string;
  type: string;
  status: string;
  profile_image_url: null | string;
}

export interface User {
  em_address: string;
}

export interface Payment {
  resy_fee_amount: number;
  service_charge_amount: number;
  tax_amount: number;
  invoice: Invoice;
  display: PaymentDisplay;
}

export interface PaymentDisplay {
  description: any[];
  buy: Buy;
}

export interface Buy {
  action: string;
  after_modifier: string;
  before_modifier: string;
  init: string;
  value: string;
}

export interface Invoice {
  items: any[];
  reservation_charge: number;
  subtotal: number;
  add_ons: number;
  quantity: number;
  resy_fee: number;
  service_charge: ServiceCharge;
  service_fee: number;
  tax: number;
  total: number;
  surcharge: number;
  price_per_unit: number;
  price_per_seat: number;
}

export interface ServiceCharge {
  amount: number;
  value: string;
}

export interface Rating {
  value: null;
  expired: boolean;
}

export interface Share {
  link: string;
  generic_message: string;
  message: Message[];
}

export interface Message {
  type: string;
  title: null | string;
  body: string;
}

export interface Status {
  finished: number;
  no_show: number;
}

export interface Template {
  images: string[];
}

export interface Ticket {
  id: null;
  is_live: boolean;
}

export interface Venue {
  id: number;
  currency: string;
}

export interface Venues {
  "50653": The50653;
}

export interface The50653 {
  social: Social[];
  content: Content[];
  config: Config;
  contact: Contact;
  hide_allergy_question: boolean;
  hide_occasion_question: boolean;
  hide_special_request_question: boolean;
  tax_included: boolean;
  venue_url_slug: string;
  id: number;
  ids: IDS;
  is_gdc: number;
  is_rga: number;
  is_global_dining_access: boolean;
  is_global_dining_access_only: boolean;
  gda_concierge_booking: boolean;
  requires_reservation_transfers: number;
  is_gns: number;
  images: string[];
  responsive_images: ResponsiveImages;
  locale: Locale;
  location: Location;
  menu_items: null;
  name: string;
  price_range_id: number;
  rater: Rater;
  rating: number;
  resy_select: number;
  survey: Survey;
  type: string;
}

export interface Config {
  enable_invite: number;
  enable_resypay: number;
  hospitality_included: number;
}

export interface Contact {
  phone_number: string;
}

export interface IDS {
  resy: number;
  foursquare: null;
  google: string;
}

export interface Locale {
  currency_type_id: number;
  currency: string;
}

export interface Location {
  address_1: string;
  address_2: null;
  locality: string;
  code: string;
  region: string;
  postal_code: string;
  cross_street_1: string;
  cross_street_2: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  time_zone: string;
}

export interface Rater {
  name: string;
  image: string;
  scale: number;
  score: number;
}

export interface ResponsiveImages {
  originals: { [key: string]: Icon };
  urls: { [key: string]: { [key: string]: { [key: string]: string } } };
  urls_by_resolution: { [key: string]: { [key: string]: UrlsByResolution } };
  file_names: string[];
  aspect_ratios: { [key: string]: { [key: string]: string } };
}

export interface UrlsByResolution {
  "1:1": string;
  "4:3"?: string;
  "16:9"?: string;
}

export interface Social {
  id: number;
  name: string;
  value: string;
}

export interface Survey {
  version: number;
}
