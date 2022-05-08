import Utils from "./Utils";
import moment from "moment";

import {
  HIT_SCHEMA,
  NOTIFY_SCHEMA,
  RESERVATION_SCHEMA,
  SLOT_SCHEMA,
  VENUE_SCHEMA,
} from "./schemas";

function ResyModifiers() {
  const ResyModifiersApi = {
    arrayToDictionary,
    dictionaryToArray,
    formatPhone,
    get,
    getFirstArrayElement,
    getFromSource,
    isFly,
    getWhyWeLikeIt,
    pastOrFuture,
    priceRange,
    rating,
    reservationIsNow,
  };
  return ResyModifiersApi;
  function arrayToDictionary(value, key) {
    return value.reduce(
      (acc, obj) => ({
        ...acc,
        [obj[key]]: obj,
      }),
      {}
    );
  }
  function dictionaryToArray(dictionary) {
    return Object.keys(dictionary);
  }
  function formatPhone(phone) {
    return Utils.parsePhone(phone)?.nationalFormat;
  }
  function get(source, key) {
    let value;
    key.split(".").forEach((val, i) => {
      value = i === 0 ? source[val] : value[val];
    });
    return value;
  }
  function getFirstArrayElement(array) {
    if (Array.isArray(array)) {
      return array[0];
    }
    return null;
  }
  function getFromSource(source, key, value) {
    if (key in source) {
      if (value in source[key]) {
        return source[key][value];
      }
      return {};
    }
    return {};
  }
  function isFly(data) {
    return data === 2;
  }
  function getWhyWeLikeIt(data) {
    const whyWeLikeIt = data.find(
      (content) => content.name === "why_we_like_it"
    );
    if (whyWeLikeIt && whyWeLikeIt.body) {
      return {
        attribution: whyWeLikeIt.attribution,
        body: whyWeLikeIt.body,
      };
    }
    return null;
  }
  function pastOrFuture(data) {
    const ACTIVE_RESERVATION_HOUR_DURATION = 3;
    if (
      moment
        .utc(data)
        .add(ACTIVE_RESERVATION_HOUR_DURATION, "hours")
        .isBefore(moment())
    ) {
      return "past";
    }
    return "future";
  }
  function priceRange(data) {
    let range = "";
    for (let i = 0; i < data; i += 1) {
      range += "$";
    }
    return range;
  }
  function rating(data) {
    if (data) {
      return data;
    }
    return 5;
  }
  function reservationIsNow(data) {
    const ACTIVE_RESERVATION_HOUR_DURATION = 3;
    const now = moment.utc();
    if (
      moment
        .utc(data)
        .add(ACTIVE_RESERVATION_HOUR_DURATION, "hours")
        .isAfter(now) &&
      moment.utc(data).isBefore(now)
    ) {
      return true;
    }
    return false;
  }
}

function finder4(source) {
  const response = {
    query: source.query,
    results: {
      venues: [],
    },
  };
  response.results.venues = source.results.venues.map((ven) => {
    const schema = {
      notifies: [NOTIFY_SCHEMA],
      slots: [SLOT_SCHEMA.FLY],
      templates: "templates",
      venue: VENUE_SCHEMA.FINDER,
    };
    return transform(ven, schema);
  });
  return response;
}
function affiliatedRestaurants(source) {
  return source.results.venues.map((ven) => ({
    id: ven.venue.id.resy,
    name: ven.venue.name,
    location: ven.venue.location,
    cuisine: ven.venue.type,
    collections: ven.venue.collections,
    priceRange: ven.venue.price_range,
    rating: ven.venue.rating,
    totalRatings: ven.venue.total_ratings,
    urlSlug: ven.venue.url_slug,
  }));
}
function inviteDetails(source) {
  const ven = transform(source.venue, VENUE_SCHEMA.INVITE);
  return {
    ...source,
    venue: ven,
  };
}
function listVenues(source) {
  return source.map((ven) => transform(ven, VENUE_SCHEMA.LIST_VENUES));
}
function reservations(source) {
  // Find and replace each reservation's venue id with the venue data
  return source.reservations
    .map((reservation) =>
      Object.assign(reservation, {
        currencyCode: reservation.venue.currency,
        venue: source.venues[reservation.venue.id],
      })
    )
    .map((reservation) => transform(reservation, RESERVATION_SCHEMA));
}
function autocompleteSearch(source) {
  const {
    search: { hits } /* eslint-disable-next-line no-shadow */,
    suggestions,
  } = source;
  const res = {
    facetValues: suggestions.map((suggestion) => ({
      ...suggestion,
      facet: true,
    })),
    hits: hits.map((hit) => transform(hit, HIT_SCHEMA.AUTOCOMPLETE)),
  };
  return res;
}
function search(source) {
  const { total_pages: nbPages } = source.meta;
  const { hits } = source.search;
  return {
    results: [
      {
        hits: hits.map((hit) => {
          const transformedSearchResult = transform(
            hit,
            HIT_SCHEMA.SEARCH_RESULT
          );
          const activeNotificationsArray = Object.keys(
            transformedSearchResult.activeNotifications
          ).map((serviceTypeId) => ({
            [serviceTypeId]: transform(
              transformedSearchResult.activeNotifications[serviceTypeId],
              NOTIFY_SCHEMA
            ),
          }));
          const activeNotifications = activeNotificationsArray.reduce(
            (memo, notifies) => {
              const shiftKey = Object.keys(notifies)[0];
              memo[shiftKey] = notifies[shiftKey];
              return memo;
            },
            {}
          );
          return {
            ...transformedSearchResult,
            activeNotifications,
            slots: hit.availability.slots.map((slot) =>
              transform(slot, SLOT_SCHEMA.SEARCH.FLY)
            ),
          };
        }),
        nbPages,
      },
    ],
  };
}
function suggestions(source) {
  const getImageUrl = (images) => {
    const key = images.file_names[0];
    if (!key) {
      return "";
    }
    return images.urls[key]["1:1"]["200"];
  };
  return source.results.map((result) => {
    /* eslint-disable-next-line no-shadow */
    const { venue } = result;
    return {
      collections: venue.collections,
      cuisine: venue.type,
      id: venue.id.resy,
      location: {
        code: venue.location.code,
        neighborhood: venue.location.neighborhood,
      },
      image: getImageUrl(venue.responsive_images),
      name: venue.name,
      priceRange: venue.price_range,
      rating: venue.rating,
      slots: result.slots,
      totalRatings: venue.total_ratings,
      urlSlug: venue.url_slug,
    };
  });
}
function venue(source) {
  return transform(source, VENUE_SCHEMA.VENUE);
}
function transform(source, schema, response?: any) {
  let localResponse = response;
  if (Utils.isUndefined(localResponse)) {
    localResponse = {};
  }
  Object.keys(schema).forEach((key) => {
    if (Utils.isArray(schema[key])) {
      localResponse[key] = source[key].map((element) =>
        transform(
          {
            ...element,
            ...source,
          },
          schema[key][0]
        )
      );
    } else if (Utils.isObject(schema[key]) && !("_modifier" in schema[key])) {
      localResponse[key] = {};
      const obj = source[key];
      transform(
        {
          ...source,
          ...obj,
        },
        schema[key],
        localResponse[key]
      );
    } else {
      let value;
      let modifier;
      if (Utils.isObject(schema[key]) && "_modifier" in schema[key]) {
        modifier = schema[key]._modifier;
        // eslint-disable-line no-param-reassign
        value = Utils.getFromBreadcrumbs(source, schema[key].breadcrumbs);
      } else {
        value = Utils.getFromBreadcrumbs(source, schema[key]);
      }
      if (!Utils.isUndefined(modifier)) {
        if (Utils.isArray(modifier)) {
          modifier.forEach((mod) => {
            if (mod.needsSource) {
              value = ResyModifiers[mod.name](source, mod.key, value);
            } else {
              value = ResyModifiers[mod.name](value, mod.key);
            }
          });
          localResponse[key] = value;
        } else {
          localResponse[key] = ResyModifiers[modifier](value);
        }
      } else {
        localResponse[key] = value;
      }
    }
  });
  return localResponse;
}

const ResyTransformer = {
  affiliatedRestaurants,
  autocompleteSearch,
  finder4,
  inviteDetails,
  listVenues,
  reservations,
  search,
  suggestions,
  venue,
};
export default ResyTransformer;
