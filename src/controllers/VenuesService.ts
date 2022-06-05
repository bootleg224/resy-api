import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";
const __dirname = dirname(fileURLToPath(import.meta.url));

export interface VenueToWatch {
  name: string;
  id: number;
  notified: boolean;
  shouldBook: boolean;
  reservationDetails?: any;
  minTime: string;
  preferredTime: string;
  maxTime: string;
  uuid: string;
  partySize?: number;
  allowedDates: string[];
}

interface DbSchema {
  venues: VenueToWatch[];
}
class VenuesService {
  db: Low<DbSchema>;

  constructor() {
    // Use JSON file for storage
    const file = join(__dirname, "../../db.json");
    const adapter = new JSONFile<DbSchema>(file);
    const db = new Low(adapter);
    this.db = db;
  }

  init = async () => {
    // Read data from JSON file, this will set db.data content
    await this.db.read();
    this.db.data ||= { venues: [] };
    this.db.data.venues.forEach((v) => {
      v.uuid ??= uuid();
      v.partySize ??= 2;
    });
  };

  save = async () => {
    await this.db.write();
  };

  getAllWatchedVenues = async () => {
    return this.db.data?.venues || [];
  };

  getWatchedVenues = async () => {
    return (this.db.data?.venues || []).filter(
      (v) => !v.reservationDetails && (v.shouldBook || !v.notified)
    );
  };

  addWatchedVenue = async (venue: VenueToWatch) => {
    venue.uuid = uuid();
    this.db.data!.venues.push(venue);
    await this.save();
  };

  updateWatchedVenue = async (venue: VenueToWatch) => {
    const venues = this.db.data!.venues || [];
    for (let i = 0; i < venues.length; i++) {
      if (venues[i].uuid === venue.uuid) {
        venues[i] = venue;
        break;
      }
    }
    await this.save();
  };
}

export default VenuesService;
