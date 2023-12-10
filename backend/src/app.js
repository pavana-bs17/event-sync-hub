const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { format } = require('date-fns');
const querystring = require('querystring');
const url = require('url');

const app = express();
const port = 3001;

app.use(bodyParser.json());

class Event {
  constructor(title, location, date, time) {
    this.title = title;
    this.location = location;
    this.date = date;
    this.time = time;
  }
}

function generateGoogleCalendarURL(event) {
  const startDateTime = new Date(`${event.date} ${event.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Assuming event lasts for 1 hour

  const googleCalendarURL = url.format({
    protocol: 'https',
    host: 'www.google.com',
    pathname: '/calendar/render',
    query: {
      action: 'TEMPLATE',
      text: event.title,
      location: event.location,
      details: event.title,
      dates: `${startDateTime.toISOString()}/${endDateTime.toISOString()}`,
    },
  });

  return googleCalendarURL;
}

function generateICalFile(event, filename) {
  const startDateTime = new Date(`${event.date} ${event.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Assuming event lasts for 1 hour

  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.title}
DTSTART:${format(startDateTime, 'yyyyMMddTHHmmss')}
DTEND:${format(endDateTime, 'yyyyMMddTHHmmss')}
END:VEVENT
END:VCALENDAR`;

  fs.writeFileSync(filename, icalContent);
}

app.post('/api/create-event', (req, res) => {
  const { title, location, date, time } = req.body;
  const event = new Event(title, location, date, time);

  const googleCalendarURL = generateGoogleCalendarURL(event);
  if (!googleCalendarURL) {
    res.status(500).json({ error: 'Error generating Google Calendar Event URL' });
    return;
  }

  const icalFilename = `${event.title}.ics`;
  generateICalFile(event, icalFilename);

  res.json({ googleCalendarURL, message: `iCalendar file '${icalFilename}' and Google Calendar Event URL generated successfully.` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
