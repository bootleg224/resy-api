export interface DetailsResponse {
  cancellation: Cancellation;
  change: Change;
  config: DetailsResponseConfig;
  locale: DetailsResponseLocale;
  payment: Payment;
  user: User;
  venue: Venue;
  viewers: Viewers;
  book_token?: BookToken;
}

export interface BookToken {
  date_expires: Date;
  value: string;
}

export interface Cancellation {
  credit: Change;
  display: CancellationDisplay;
  fee: null;
  refund: Change;
}

export interface Change {
  date_cut_off: Date | null;
}

export interface CancellationDisplay {
  policy: string[];
}

export interface DetailsResponseConfig {
  add_ons: null;
  double_confirmation: null;
  features: null;
  menu_items: string[];
  service_charge_options: null;
}

export interface DetailsResponseLocale {
  currency: string;
}

export interface Payment {
  amounts: PaymentAmounts;
  comp: boolean;
  config: DisplayClass;
  display: PaymentDisplay;
  options: Option[];
}

export interface PaymentAmounts {
  items: any[];
  reservation_charge: number;
  subtotal: number;
  add_ons: number;
  quantity: number;
  resy_fee: number;
  service_fee: number;
  service_charge: ServiceCharge;
  tax: number;
  total: number;
  surcharge: number;
  price_per_unit: number;
}

export interface ServiceCharge {
  amount: number;
  value: string;
}

export interface DisplayClass {
  type: string;
}

export interface PaymentDisplay {
  balance: Balance;
  buy: Buy;
  description: any[];
}

export interface Balance {
  value: string;
  modifier: string;
}

export interface Buy {
  action: string;
  after_modifier: string;
  before_modifier: string;
  init: string;
  value: string;
}

export interface Option {
  amounts: OptionAmounts;
}

export interface OptionAmounts {
  price_per_unit: number;
  resy_fee: number;
  service_fee: number;
  service_charge: ServiceCharge;
  tax: number;
  total: number;
}

export interface User {
  payment_methods: PaymentMethod[];
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

export interface Venue {
  config: VenueConfig;
  content: Content[];
  location: Location;
  rater: Rater[];
  source: Source;
}

export interface VenueConfig {
  allow_bypass_payment_method: number;
  allow_multiple_resys: number;
  enable_invite: number;
  enable_resypay: number;
  hospitality_included: number;
}

export interface Content {
  attribution: null;
  body: null | string;
  display: DisplayClass;
  icon: Icon;
  locale: ContentLocale | null;
  name: string;
  title: null;
}

export interface Icon {
  url: null | string;
}

export interface ContentLocale {
  language: string;
}

export interface Location {
  address_1: string;
  address_2: null;
  code: string;
  country: string;
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

export interface Rater {
  name: string;
  scale: number;
  score: number;
  total: number;
}

export interface Source {
  name: null;
  logo: null;
  terms_of_service: null;
  privacy_policy: null;
}

export interface Viewers {
  total: number;
}
