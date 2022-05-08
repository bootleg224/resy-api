import Utils from "./Utils";
import RequestBuilder from "./RequestBuilder";
import ResyTransformer from "./ResyTransformer";

const ServicesConfig = {
  getName(name: string) {
    switch (name) {
      case "annotationService":
        return "https://annotation.resy.com/";
      case "itemsService":
        return "https://item.resy.com/";
      case "resyosService":
        return "https://api.resyos.com/";
    }
  },
  getService(name: string) {
    return { baseRequestUrl: ServicesConfig.getName(name) };
  },
};

export function ResyApi() {
  const config = (params) => {
    const requestObj: Record<string, any> = {
      endpoint: "2/config",
      data: undefined,
    };
    if (Utils.isObject(params)) {
      requestObj.data = {
        venue_id: params.venueId,
      };
    }
    return RequestBuilder.get(requestObj);
  };
  const annotations = {
    getTags() {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("annotationService").baseRequestUrl,
        endpoint: "1/tags",
      });
    },
  };
  const geoip = () =>
    RequestBuilder.get({
      endpoint: "3/geoip",
    });
  const items = {
    getByVenue(venueId, data) {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("itemsService").baseRequestUrl,
        endpoint: "1/".concat(venueId, "/items"),
        data,
      });
    },
    getByTemplate(venueId, templateId, data) {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("itemsService").baseRequestUrl,
        endpoint: "1/"
          .concat(venueId, "/templates/")
          .concat(templateId, "/items"),
        data,
      });
    },
    getMenusByTemplate(venueId, templateId, data) {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("itemsService").baseRequestUrl,
        endpoint: "1/"
          .concat(venueId, "/templates/")
          .concat(templateId, "/menus"),
        data,
      });
    },
  };
  const search = {
    autocompleteSearch(data) {
      return RequestBuilder.postProxy({
        endpoint: "3/venuesearch/search",
        data,
      }).then((response) => ResyTransformer.autocompleteSearch(response));
    },
    config(version) {
      return RequestBuilder.get({
        endpoint: "3/venuesearch/config",
        data: {
          version,
        },
      });
    },
    execute(data) {
      return RequestBuilder.postProxy({
        endpoint: "3/venuesearch/search",
        data,
      }).then((response) => ResyTransformer.search(response));
    },
  };
  const contact = (userInfo) =>
    RequestBuilder.post({
      endpoint: "2/contact",
      data: {
        value: userInfo,
      },
    });
  const find = (data) =>
    RequestBuilder.get({
      endpoint: "4/find",
      data,
    }).then((response) => ResyTransformer.finder4(response));
  const getSignedMapUrl = (url) =>
    RequestBuilder.get({
      endpoint: "3/google/static_maps/url/sign",
      data: {
        url,
      },
    });
  const topVenues = (data) =>
    RequestBuilder.get({
      endpoint: "2/venues/top",
      data: {
        location_id: data.locationId,
        day: data.day,
        num_seats: data.num_seats,
      },
    });
  const hospitality = (data) =>
    RequestBuilder.post({
      endpoint: "2/hospitality",
      data,
    });
  const rating = {
    submit(data) {
      const payload: Record<string, any> = {
        value: data.rating,
        struct_tags: data.tags,
      };
      if ("authToken" in data && !!data.authToken) {
        payload.auth_token = data.authToken;
      }
      if ("uniqueKey" in data && !!data.uniqueKey) {
        payload.unique_key = data.uniqueKey;
      } else if ("resyToken" in data && !!data.resyToken) {
        payload.resy_token = data.resyToken;
      } else {
        console.error(
          "[ERROR] ResyApi /3/rate/reservation is missing a required parameter."
        );
        // eslint-disable-line
        return;
      }
      if (
        "comments" in data &&
        Utils.isString(data.comments) &&
        data.comments !== ""
      ) {
        payload.comments = data.comments;
      }
      /* eslint-disable */
      return RequestBuilder.post({
        endpoint: "3/rate/reservation",
        data: payload,
        authAllowed: true,
      });
      /* eslint-enable */
    },
  };
  const party = {
    addGuests(data) {
      const postData: Record<string, any> = {
        resy_token: data.resyToken,
      };
      const user: Record<string, any> = {};
      if (Utils.isString(data.firstName) && data.firstName.length > 0) {
        user.first_name = data.firstName;
      }
      if (Utils.isString(data.lastName) && data.lastName.length > 0) {
        user.last_name = data.lastName;
      }
      if (Utils.isString(data.contact) && data.contact.length > 0) {
        user.contact = data.contact;
      }
      if (Utils.isString(data.userId) && data.userId.length > 0) {
        user.user_id = data.userId;
      }
      postData.struct_data = [user];
      return RequestBuilder.post({
        endpoint: "2/party/invite/guests",
        data: postData,
      });
    },
    getTags(partyId) {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/reservation/".concat(partyId, "/tags"),
      });
    },
    guest: {
      confirm(token) {
        return RequestBuilder.post({
          endpoint: "3/party/invite/confirm",
          data: {
            host_attendee_token: token,
          },
        });
      },
      decline(token) {
        return RequestBuilder.post({
          endpoint: "3/party/invite/decline",
          data: {
            host_attendee_token: token,
          },
        });
      },
      remove(_ref) {
        const { guestToken, resyToken } = _ref;
        return RequestBuilder.delete({
          endpoint: "2/party/guest",
          data: {
            resy_token: resyToken,
            attendee_token: guestToken,
          },
        });
      },
    },
    invite: {
      details(token) {
        return RequestBuilder.get({
          endpoint: "3/party/invite/details",
          data: {
            host_attendee_token: token,
          },
        }).then((response) => ResyTransformer.inviteDetails(response));
      },
    },
    setTags(partyId) {
      const tags =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/reservation/".concat(partyId, "/tags"),
        data: {
          tags,
        },
      });
    },
    getDietaryNote(_ref2) {
      const { partyId } = _ref2;
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes/list",
        data: {
          entity: {
            id: partyId,
            type_id: 4,
          },
        },
      });
    },
    setDietaryNote(data) {
      const payload = {
        note: {
          id: data.noteId || null,
          category_id: 1,
          // Food and beverage
          body: data.body,
          entity: {
            id: data.id,
            type_id: 4, // reservation
          },
          notable: false,
        },
      };
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes",
        data: payload,
      });
    },
    deleteDietaryNote(data) {
      const payload = {
        note: {
          id: data.noteId,
          entity: {
            id: data.entityId,
            type_id: 4, // reservation
          },
        },
      };
      return RequestBuilder.deleteProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes",
        data: payload,
      });
    },
  };
  const listVenues = (locationId) =>
    RequestBuilder.get({
      endpoint: "2/venues",
      data: {
        location_id: locationId,
      },
    }).then((response) => ResyTransformer.listVenues(response));
  const location = (lat, long) =>
    RequestBuilder.get({
      endpoint: "3/location",
      data: {
        lat,
        long,
      },
    });
  const locations = (lat, long) =>
    RequestBuilder.get({
      endpoint: "3/location/config",
      data: {
        lat,
        long,
      },
    });
  const venue = {
    get(id) {
      return RequestBuilder.get({
        endpoint: "3/venue",
        data: {
          id,
        },
      }).then((response) => ResyTransformer.venue(response));
    },
    getByUrlSlug(urlSlug, locationId) {
      return RequestBuilder.get({
        endpoint: "3/venue",
        data: {
          url_slug: urlSlug,
          location: locationId,
        },
      }).then((response) => ResyTransformer.venue(response));
    },
    getReservations(params) {
      return RequestBuilder.get({
        endpoint: "4/find",
        data: {
          lat: 0,
          long: 0,
          day: params.day,
          party_size: params.party_size,
          venue_id: params.venue_id,
          resy_token: params.resy_token,
        },
      }).then((response) => ResyTransformer.finder4(response));
    },
    getCalendar(params) {
      return RequestBuilder.get({
        endpoint: "4/venue/calendar",
        data: {
          venue_id: params.venueId,
          num_seats: params.numSeats,
          start_date: params.startDate,
          end_date: params.endDate,
        },
      });
    },
    getAffiliatedRestaurants(params) {
      const payload = {
        ...params,
        sort_by: "available",
      };
      return RequestBuilder.get({
        endpoint: "4/find",
        data: payload,
      }).then((response) => ResyTransformer.affiliatedRestaurants(response));
    },
  };
  const reservation = {
    get(params) {
      return RequestBuilder.get({
        endpoint: "3/details",
        data: params,
      });
    },
    postToDetails(params) {
      return RequestBuilder.postProxy({
        endpoint: "3/details",
        data: params,
      });
    },
    book(data) {
      let endpoint;
      const postData: Record<string, any> = {
        book_token: data.bookToken,
      };
      if (data.bookOnBehalfOf) {
        endpoint = "3/concierge/book";
        postData.struct_guest = {
          em_address: data.bookOnBehalfOf.email,
          mobile_number: data.bookOnBehalfOf.mobile_number,
          first_name: data.bookOnBehalfOf.first_name,
          last_name: data.bookOnBehalfOf.last_name,
        };
      } else if (Utils.isUndefined(data.existingResyToken)) {
        endpoint = "3/book";
      } else {
        endpoint = "3/change";
        postData.resy_token = data.existingResyToken;
      }
      if (data.replace) {
        postData.replace = 1;
      }
      if (Utils.isNumber(data.paymentId) && data.paymentId !== -1) {
        postData.struct_payment_method = {
          id: data.paymentId,
        };
      }
      // one time use credit cards
      if (data.nonce && data.paymentId === -1) {
        postData.struct_payment_method = {
          nonce: data.nonce,
        };
      }
      if (Utils.isString(data.src)) {
        postData.source_id = data.src;
      }
      if (Utils.isString(data.affId)) {
        postData.affiliate_id = data.affId;
      }
      if (Utils.isString(data.offerId)) {
        postData.offer_id = data.offerId;
      }
      if (Utils.isString(data.airbnbBookingId)) {
        postData.struct_reference = {
          provider: "airbnb",
          value: data.airbnbBookingId,
        };
      }
      return RequestBuilder.post({
        endpoint,
        data: postData,
      });
    },
    cancel(data) {
      let endpoint = "3/cancel";
      if (data.concierge_resy_token) {
        endpoint = "3/concierge/cancel";
      }
      return RequestBuilder.post({
        endpoint,
        data,
      });
    },
    specialRequest(data) {
      let endpoint = "2/reservation/special_request";
      const postData: Record<string, any> = {};
      if (data.conciergeResyToken) {
        endpoint = "3/concierge/special_request";
        postData.concierge_resy_token = data.conciergeResyToken;
        if ("occasionName" in data) {
          postData.occasion = data.occasionName;
          postData.occasion_id = data.occasionId;
        } else {
          postData.special_request = data.request;
        }
      } else if ("occasionName" in data) {
        postData.resy_token = data.resyToken;
        postData.occasion = data.occasionName;
        postData.occasion_id = data.occasionId;
      } else {
        postData.resy_token = data.resyToken;
        postData.description = data.request;
      }
      return RequestBuilder.post({
        endpoint,
        data: postData,
      });
    },
  };
  const auth = {
    password(params) {
      return RequestBuilder.post({
        endpoint: "3/auth/password",
        data: {
          email: params.email,
          password: params.password,
        },
      });
    },
    mobile(data) {
      return RequestBuilder.post({
        data,
        endpoint: "3/auth/mobile",
        authAllowed: false,
      });
    },
    challenge(data) {
      return RequestBuilder.post({
        data,
        endpoint: "/3/auth/challenge",
        authAllowed: false,
      });
    },
    generateEmailCode(data) {
      return RequestBuilder.post({
        data,
        endpoint: "3/auth/email/request",
      });
    },
    verifyEmailCode(data) {
      return RequestBuilder.post({
        data,
        endpoint: "3/auth/email/verify",
      });
    },
  };
  const user = {
    register(data, captcha) {
      const dataWithCaptcha = {
        ...data,
        captcha_token: captcha,
      };
      return RequestBuilder.post({
        endpoint: "2/user/registration",
        data: dataWithCaptcha,
        authAllowed: false,
      });
    },
    get() {
      return RequestBuilder.get({
        endpoint: "2/user",
      });
    },
    post(data) {
      return RequestBuilder.post({
        endpoint: "2/user",
        data,
        authAllowed: false,
      });
    },
    postWithAuth(data) {
      return RequestBuilder.post({
        endpoint: "2/user",
        data,
      });
    },
    reservationDuringService(date, serviceTypeId) {
      return RequestBuilder.get({
        endpoint: "2/user/reservation",
        data: {
          day: date,
          service_type_id: serviceTypeId,
        },
      });
    },
    reservations() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let endpoint = "3/user/reservations";
      if (data.book_on_behalf_of) {
        endpoint = "3/concierge/reservations";
      }
      const payload = {
        data,
        endpoint,
      };
      return RequestBuilder.get(payload).then((response) => ({
        reservations: ResyTransformer.reservations(response),
        metadata: response.metadata,
      }));
    },
    location(data) {
      const postData: Record<string, any> = {
        x: data.long,
        y: data.lat,
      };
      if (Utils.isString(data.reg_token) && !Utils.isNull(data.reg_token)) {
        postData.reg_token = data.reg_token;
      }
      return RequestBuilder.post({
        endpoint: "2/user/location",
        data: postData,
      });
    },
    getReservation(resyToken) {
      const bookOnBehalfOf =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : false;
      let endpoint = "3/user/reservations";
      const data: Record<string, any> = {};
      if (bookOnBehalfOf) {
        endpoint = "3/concierge/reservations";
        data.concierge_resy_token = resyToken;
      } else {
        data.resy_token = resyToken;
      }
      return RequestBuilder.get({
        endpoint,
        data,
      }).then((response) => ResyTransformer.reservations(response));
    },
    getReservationForAddressForm(type, actionToken, resyToken) {
      const endpoint = "3/user/reservations";
      const payload = {
        type,
        action_token: actionToken,
        resy_token: resyToken,
      };
      return RequestBuilder.get({
        endpoint,
        data: payload,
      }).then((response) => ResyTransformer.reservations(response));
    },
    setReservationAddressForm(data) {
      const endpoint = "2/reservation/address";
      const payload = data;
      return RequestBuilder.post({
        endpoint,
        data: payload,
      });
    },
    setPrimaryPaymentMethod(id) {
      return RequestBuilder.post({
        endpoint: "2/user/payment_method",
        data: {
          payment_method_id: id,
        },
      });
    },
    removePaymentMethod(id) {
      return RequestBuilder.delete({
        endpoint: "2/user/payment_method",
        data: {
          payment_method_id: id,
        },
      });
    },
    setProfileVenueOptIn(data) {
      return RequestBuilder.post({
        endpoint: "2/user/profile/venue/opt_in",
        data: {
          /**
           * checksum is needed to differentiate new submissions
           * from earlier submissions that had sent an incorrect `optIn` value
           */
          checksum: 1,
          venue_id: data.venueId,
          opt_in: data.optIn ? 1 : 0,
        },
      });
    },
    setProfileEmailOptOut(data) {
      return RequestBuilder.post({
        endpoint: "2/user/profile/email/opt_out",
        data: {
          email_type_id: data.id,
          opt_in: data.optIn ? 1 : 0,
        },
      });
    },
    getProfileLocations() {
      return RequestBuilder.get({
        endpoint: "2/user/profile/locations",
      });
    },
    setProfileLocations(data) {
      const payload: Record<string, any> = {
        struct_location: JSON.stringify(data.locationCodes),
      };
      if ("isMarketable" in data) {
        payload.is_marketable = data.isMarketable ? 1 : 0;
      }
      if ("primaryLocationCode" in data) {
        // When no primary location is selected, this is null
        // and the API expects an empty string
        payload.primary_location_code = data.primaryLocationCode || "";
      }
      return RequestBuilder.post({
        endpoint: "2/user/profile/locations",
        data: payload,
      });
    },
    getConciergeRegistration() {
      // --> { status: null }       by default
      // --> { status: "pending" }  after submitting request
      return RequestBuilder.get({
        endpoint: "2/user/profile/concierge/registration",
      });
    },
    setConciergeRegistration(data) {
      // data : { company, reason }
      return RequestBuilder.post({
        endpoint: "2/user/profile/concierge/registration",
        data,
      });
    },
    getProfileTags() {
      return RequestBuilder.get({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/guest/tags",
      });
    },
    setProfileTags(data) {
      let payload = [];
      if ("dietRestrictionIds" in data) {
        payload = data.dietRestrictionIds.reduce((result, item) => {
          result.push({
            id: parseInt(item, 10),
          });
          return result;
        }, payload);
      }
      if ("allergyIds" in data) {
        payload = data.allergyIds.reduce((result, item) => {
          result.push({
            id: parseInt(item, 10),
          });
          return result;
        }, payload);
      }
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/guest/tags",
        data: {
          tags: payload,
        },
      });
    },
    getProfileAllergies() {
      return RequestBuilder.get({
        endpoint: "2/user/profile/allergies",
      });
    },
    setProfileAllergies(data) {
      const payload: Record<string, any> = {};
      if ("allergyText" in data) {
        payload.allergy_text = data.allergyText;
      }
      if ("dietRestrictionIds" in data) {
        payload.struct_diet_restriction = JSON.stringify({
          diet_restriction_ids: data.dietRestrictionIds,
          diet_restriction_other: [],
        });
      }
      if ("allergyIds" in data) {
        payload.struct_allergy = JSON.stringify({
          allergy_ids: data.allergyIds,
          allergy_other: [],
        });
      }
      return RequestBuilder.post({
        endpoint: "2/user/profile/allergies",
        data: payload,
      });
    },
    getDietaryNote(data) {
      const payload = {
        entity: {
          id: data.id,
          type_id: 1, // user
        },
      };
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes/list",
        data: payload,
      });
    },
    setDietaryNote(data) {
      const payload = {
        note: {
          id: data.noteId || null,
          category_id: 1,
          // Food and beverage
          body: data.body,
          entity: {
            id: data.id,
            // user's guest_id
            type_id: 1, // user
          },
          notable: false,
        },
      };
      return RequestBuilder.postProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes",
        data: payload,
      });
    },
    deleteDietaryNote(data) {
      const payload = {
        note: {
          id: data.noteId,
          entity: {
            id: data.entityId,
            type_id: 1, // user
          },
        },
      };
      return RequestBuilder.deleteProxy({
        baseRequestUrl:
          ServicesConfig.getService("resyosService").baseRequestUrl,
        endpoint: "1/consumer/notes",
        data: payload,
      });
    },
    optOut(_ref3) {
      const { token } = _ref3;
      return RequestBuilder.post({
        endpoint: "2/user/profile/rating/opt_out",
        data: {
          unique_key: token,
        },
      });
    },
  };
  const notify = {
    get() {
      return RequestBuilder.get({
        endpoint: "2/notify",
      });
    },
    create(data) {
      return RequestBuilder.post({
        endpoint: "2/notify",
        data,
      });
    },
    cancel(data) {
      return RequestBuilder.delete({
        endpoint: "2/notify",
        data,
      });
    },
  };
  const braintree = {
    clientToken() {
      return RequestBuilder.get({
        endpoint: "2/braintree/client_token/generate",
        authAllowed: false,
      });
    },
    storePayment(nonce, captcha) {
      return RequestBuilder.post({
        endpoint: "2/braintree/payment_method",
        data: {
          payment_method_nonce: nonce,
          captcha_token: captcha,
        },
      });
    },
  };
  const password = {
    sendReset(email) {
      return RequestBuilder.post({
        endpoint: "2/forgot_password",
        data: {
          email,
        },
      });
    },
    setNew(key, newPassword) {
      /*
       * backwards support for deprecated unique_key
       * remove once all unique_key's are phased out
       */
      const isLegacyUniqueKey = key.match(/U[a-zA-Z0-9]{13}/);
      const tokenKey = isLegacyUniqueKey ? "unique_key" : "token";
      const data = {
        [tokenKey]: key,
        password: newPassword,
      };
      return RequestBuilder.post({
        endpoint: "2/user/reset_password",
        data,
        authAllowed: false,
      });
    },
  };
  const prepay = {
    get(token) {
      return RequestBuilder.get({
        endpoint: "3/proxy/os/prepay",
        data: {
          web_key: token,
        },
      });
    },
    post(token, data) {
      return RequestBuilder.postProxy({
        endpoint: "3/proxy/os/prepay",
        data: {
          web_key: token,
          prepay: data,
        },
      });
    },
  };
  const statistics = () =>
    RequestBuilder.get({
      endpoint: "3/statistics",
    });
  const collections = {
    get(data) {
      return RequestBuilder.get({
        endpoint: "3/collections",
        data: {
          location_id: data.locationCode,
          include_algo: data.includeAlgorithmicLists,
        },
      });
    },
    getMarketingCollections(data) {
      return RequestBuilder.get({
        endpoint: "3/marketing/collections",
        data: {
          location_id: data.locationCode,
          include_algo: data.includeAlgorithmicLists,
        },
      });
    },
    getVenues(data) {
      const payload: Record<string, any> = {
        location_id: data.locationCode,
        collection_id: data.collectionId,
        day: data.day,
        party_size: data.partySize,
        lat: data.lat,
        long: data.long,
        limit: data.limit,
        offset: data.offset,
        finder: 4,
      };
      if ("startTime" in data && !!data.startTime) {
        payload.time_start = data.startTime;
      }
      if ("endTime" in data && !!data.endTime) {
        payload.time_end = data.endTime;
      }
      return RequestBuilder.get({
        endpoint: "3/collection/venues",
        data: payload,
      }).then((response) => ResyTransformer.finder4(response));
    },
    getMarketingVenues(data) {
      const payload: Record<string, any> = {
        location_id: data.locationCode,
        collection_id: data.collectionId,
        day: data.day,
        party_size: data.partySize,
        lat: data.lat,
        long: data.long,
        limit: data.limit,
        offset: data.offset,
        finder: 4,
      };
      if ("startTime" in data && !!data.startTime) {
        payload.time_start = data.startTime;
      }
      if ("endTime" in data && !!data.endTime) {
        payload.time_end = data.endTime;
      }
      return RequestBuilder.get({
        endpoint: "3/marketing/collection/venues",
        data: payload,
      }).then((response) => ResyTransformer.finder4(response));
    },
    getRecommendedVenues(data) {
      const payload = {
        location: data.locationCode,
        day: data.day,
        party_size: data.partySize,
        lat: data.lat,
        long: data.long,
      };
      return RequestBuilder.get({
        endpoint: "3/user/recommendations",
        data: payload,
      }).then((response) => ResyTransformer.finder4(response));
    },
  };
  const getSuggestions = (data) => {
    const payload = {
      location_id: data.locationId,
      day: data.selectedDate,
      party_size: data.partySize,
    };
    return RequestBuilder.get({
      endpoint: "3/collection/suggestions",
      data: payload,
    }).then((response) => ResyTransformer.suggestions(response));
  };
  const bookTonight = (data) => {
    const payload: Record<string, any> = {
      location: data.locationCode,
      day: data.day,
      party_size: data.partySize,
      lat: data.lat,
      long: data.long,
      finder: 4,
      limit: data.limit,
      offset: data.offset,
    };
    if ("startTime" in data && !!data.startTime) {
      payload.time_start = data.startTime;
    }
    if ("endTime" in data && !!data.endTime) {
      payload.time_end = data.endTime;
    }
    return RequestBuilder.get({
      endpoint: "3/venues/book_tonight",
      data: payload,
    }).then((response) => ResyTransformer.finder4(response));
  };
  const algorithmicList = (type, data) => {
    const payload: Record<string, any> = {
      location: data.locationCode,
      day: data.day,
      party_size: data.partySize,
      lat: data.lat,
      long: data.long,
      finder: 4,
      limit: data.limit,
      offset: data.offset,
    };
    if ("startTime" in data && !!data.startTime) {
      payload.time_start = data.startTime;
    }
    if ("endTime" in data && !!data.endTime) {
      payload.time_end = data.endTime;
    }
    return RequestBuilder.get({
      endpoint: "3/venues/".concat(type),
      data: payload,
    }).then((response) => ResyTransformer.finder4(response));
  };
  const favorites = {
    get() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return RequestBuilder.get({
        endpoint: "/3/user/favorites",
        data: {
          lat: data.lat,
          long: data.long,
        },
      }).then((response) => ResyTransformer.finder4(response));
    },
    post() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return RequestBuilder.post({
        endpoint: "/3/user/favorites",
        data: {
          venue_id: data.venueId,
          favorite: data.favorite,
        },
      }).then((response) => response);
    },
  };
  const amexOffers = () =>
    RequestBuilder.get({
      endpoint: "3/amex_offers",
    });
  const events = {
    byLocation() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return RequestBuilder.get({
        endpoint: "3/events/location",
        data: {
          filter_exclusive: data.filter_exclusive || null,
          limit: data.limit || null,
          location_id: data.locationId,
          start_date: data.startDate || new Date().toISOString().split("T")[0],
        },
      }).then((response) => response);
    },
    existOnDay() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return RequestBuilder.get({
        endpoint: "3/events",
        data: {
          day: data.day,
          venue_id: data.venue_id,
        },
      }).then((res) => !!res.events && !!res.events.length);
    },
    upcoming() {
      const data =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return RequestBuilder.get({
        endpoint: "3/events/upcoming",
        data: {
          venue_id: data.venue_id,
        },
      }).then((response) => response);
    },
  };
  return {
    algorithmicList,
    auth,
    bookTonight,
    braintree,
    collections,
    config,
    contact,
    events,
    favorites,
    find,
    geoip,
    getSignedMapUrl,
    getSuggestions,
    hospitality,
    annotations,
    items,
    listVenues,
    location,
    locations,
    notify,
    party,
    password,
    prepay,
    rating,
    reservation,
    search,
    statistics,
    topVenues,
    user,
    venue,
    amexOffers,
  };
}
