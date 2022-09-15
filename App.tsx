import * as React from 'react';
import './style.css';
import { useMemo } from 'react';
import { DateTime } from 'luxon';

/*
We have a list of timestamped glucose readings. We want to group them by date.

Implement the function `groupReadingsByDate` that takes as input list of readings:

```json
[
  {
    "datetime": "2022-08-01T00:00:00",
    "glucose": 80
  },
  {
    "datetime": "2022-08-01T00:15:00",
    "glucose": 85
  },
  {
    "datetime": "2022-08-01T01:00:00",
    "glucose": 79
  },
  {
    "datetime": "2022-08-02T00:15:00",
    "glucose": 83
  },
  {
    "datetime": "2022-08-02T00:45:00",
    "glucose": 86
  },
  {
    "datetime": "2022-08-02T15:30:00",
    "glucose": 90
  }
]
```

The output should be the list of readings grouped by date:

```json
[
  {
    "date": "2022-08-01",
    "glucoseReadings": [
      {
        "time": "00:00:00",
        "glucose": 80
      },
      {
        "time": "00:15:00",
        "glucose": 85
      },
      {
        "time": "01:00:00",
        "glucose": 79
      }
    ]
  },
  {
    "date": "2022-08-02",
    "glucoseReadings": [
      {
        "time": "00:15:00",
        "glucose": 83
      },
      {
        "time": "00:45:00",
        "glucose": 86
      },
      {
        "time": "15:30:00",
        "glucose": 90
      }
    ]
  }
]
```

Notes:
  - You can assume that the input readings will be sorted by timestamp.
  - No need to make sure that the output days are sorted by date, nor that each day's readings are sorted by time.
  - No need to think about timezone.
  - You can assume that the timestamp format will always be YYYY-MM-DDTHH:mm:ss
*/

// Input:

type GlucoseReading = {
  datetime: string; // Example: '2022-08-01T08:15:00`
  glucose: number; // Example: 80
};

type Input = Array<GlucoseReading>;

// Output:

type GlucoseReadingInADay = {
  time: string; // Example: '08:30:00'
  glucose: number; // Example: 80
};

type DayReadings = {
  date: string; // Example: '2022-08-01'
  glucoseReadings: Array<GlucoseReadingInADay>;
};

type Output = Array<DayReadings>;

// The function you'll implement
function groupReadingsByDate(glucoseReadings: Input): Output {
  // TODO: Replace this with your code
  const SAMPLE_DAYS_READINGS = [
    {
      date: '2022-08-01',
      glucoseReadings: [
        {
          time: '00:00:00',
          glucose: 80,
        },
        {
          time: '00:15:00',
          glucose: 85,
        },
        {
          time: '01:00:00',
          glucose: 79,
        },
      ],
    },
    {
      date: '2022-08-02',
      glucoseReadings: [
        {
          time: '00:15:00',
          glucose: 83,
        },
        {
          time: '00:45:00',
          glucose: 86,
        },
        {
          time: '15:30:00',
          glucose: 90,
        },
      ],
    },
  ];

  // loop on array and then filter with date
  // then push in object (date, array of its reading)
  let groupedReadings = {};

  for (let i = 0; i < glucoseReadings.length; i++) {
    glucoseReadings[i].datetime;

    const date: string = glucoseReadings[i].datetime.substring(0, 10);
    const nextDate: string = glucoseReadings[i + 1]?.datetime.substring(0, 10);

    if (date !== nextDate) {
      groupedReadings = {
        ...groupedReadings,
        [date]: glucoseReadings?.filter(
          (elem) => elem?.datetime.substring(0, 10) === date
        ),
      };
    }
  }

  const resultOutput: Output = Object.keys(groupedReadings).map((key) => ({
    date: key,
    glucoseReadings: groupedReadings[key],
  }));

  return resultOutput;
}

//=============================================================
// You do not need to read or think about code below this line.
//=============================================================

export default function App() {
  const glucoseReadings = useGlucoseReadings();

  const daysReadings = useMemo(
    () => groupReadingsByDate(glucoseReadings),
    [glucoseReadings]
  );

  return (
    <div>
      <h1>Input timestamped readings</h1>
      <pre>
        <code>{JSON.stringify(glucoseReadings, null, 2)}</code>
      </pre>
      <h1>Output grouped readings</h1>
      <p>
        Currently, they're just sample entries, and they don't match the input
        above. Change the implementation of <code>groupReadingsByDate</code> to
        make them match.
      </p>
      <pre>
        <code>{JSON.stringify(daysReadings, null, 2)}</code>
      </pre>
    </div>
  );
}

export function useGlucoseReadings() {
  return useMemo(() => generateRandomReadings(), []);
}

function generateRandomReadings() {
  const glucoseReadings: GlucoseReading[] = [];

  const START_DATETIME = DateTime.utc(2022, 8, 1);
  const END_DATETIME = DateTime.utc(2022, 8, 8);

  for (
    let dateTime = START_DATETIME, glucoseLevel = 80;
    dateTime.toMillis() < END_DATETIME.toMillis();
    dateTime = dateTime.plus({ hours: 9, minutes: 15 }),
      glucoseLevel = calculateNewGlucoseLevel(glucoseLevel)
  ) {
    const shouldSkip = Math.random() < 0.01;

    if (shouldSkip) continue;

    glucoseReadings.push({
      datetime: dateTime.toISO({
        includeOffset: false,
        suppressMilliseconds: true,
      }),
      glucose: glucoseLevel,
    });
  }

  return glucoseReadings;
}

function calculateNewGlucoseLevel(glucoseLevel: number) {
  const delta = Math.random() * 20 - 10;

  let newGlucoseLevel = glucoseLevel + delta;

  // I'm clamping them for reasonability. I don't actually know the real min. & maximum glucose levels in humans
  if (newGlucoseLevel < 60) newGlucoseLevel = 60;
  if (newGlucoseLevel > 250) newGlucoseLevel = 250;

  return Math.floor(newGlucoseLevel);
}
