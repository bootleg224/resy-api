# Resy-API

This is an attempt at creating a javascript client for Resy. The code from Resy's homepage is in the `src/minifiedSourceCode` - it's more feature full and has more routes than my client, but is a bit harder to read because it's been minified.

The `src/controllers` has the cleaner code that's meant for more programmatic use.

## Usage

You must first set up your environment variables. These need to be

```
RESY_EMAIL
RESY_PASSWORD
```

Optionally, if you'd like text message notifications, you can also set the following twilio variables.

```
TO_NUMBER
TWILIO_AUTH
TWILIO_NUMBER
TWILIO_SID
```

## Data storage

Resy API uses `lowdb`, a small JSON db, to store its information. You can either call it programatically or you can create a file called `db.json` in the same directory as this README with the following template:

```json
{
  "venues": [
    {
      "name": "Cote",
      "id": 35676,
      "notified": false,
      "minTime": "17:00",
      "preferredTime": "19:30",
      "maxTime": "22:00",
      "shouldBook": true,
      "partySize": 2,
      "allowedDates": ["2022-06-07", "2022-06-08"]
    }
  ]
}
```

You can find the ID of the venue by searching for it on Resy in Chrome and finding one of the network requests with `venue_id` as the URL param and using that, or by searching for it programatically using the ResyService search function.

## Monitoring

You can run `yarn monitor` to run the monitoring. This will check every 5 minutes.


# ToDo

It would be nice to add a UI on top of this, or maybe even make it a service so non-technical people could use it.
