Basic Usage
```jsx
import React from 'react';
import { Table } from '@nurvus/design-system';

// mock data provided from https://www.mockaroo.com/
const data = [
  {
    id: "1",
    first_name: "Danya",
    last_name: "Tuberfield",
    email: "dtuberfield0@blogspot.com",
    ip_address: "155.124.39.178"
  },
  {
    id: "2",
    first_name: "Halette",
    last_name: "Kiltie",
    email: "hkiltie1@google.com.br",
    ip_address: "68.194.170.222"
  },
  {
    id: "3",
    first_name: "Dene",
    last_name: "Frary",
    email: "dfrary2@shinystat.com",
    ip_address: "125.232.160.118"
  },
  {
    id: "4",
    first_name: "Keeley",
    last_name: "Fullard",
    email: "kfullard3@chronoengine.com",
    ip_address: "111.189.5.201"
  },
  {
    id: "5",
    first_name: "Culver",
    last_name: "O'Lahy",
    email: "colahy4@wordpress.org",
    ip_address: "136.24.198.12"
  },
  {
    id: "6",
    first_name: "Myriam",
    last_name: "Szanto",
    email: "mszanto5@posterous.com",
    ip_address: "230.65.200.78"
  },
  {
    id: "7",
    first_name: "Matilda",
    last_name: "Hadkins",
    email: "mhadkins6@phoca.cz",
    ip_address: "163.15.137.114"
  },
  {
    id: "8",
    first_name: "Hephzibah",
    last_name: "Mothersole",
    email: "hmothersole7@ning.com",
    ip_address: "50.56.113.104"
  },
  {
    id: "9",
    first_name: "Hayley",
    last_name: "Hayers",
    email: "hhayers8@dagondesign.com",
    ip_address: "240.18.69.87"
  },
  {
    id: "10",
    first_name: "Rheba",
    last_name: "Bedbrough",
    email: "rbedbrough9@diigo.com",
    ip_address: "142.100.46.215"
  }
];

const columns = [
  {
    title: 'First Name',
    dataKey: 'first_name'
  },
  {
    title: 'Last Name',
    dataKey: 'last_name'
  },
  {
    title: 'IP Address',
    dataKey: 'ip_address'
  }
];

<Table
  columns={ columns }
  data={ data }
/>
```

Custom Column renderer
```jsx
import React from 'react';
import { Table } from '@nurvus/design-system';

// mock data provided from https://www.mockaroo.com/

const data = [
  {
    id: 1,
    Car: "Lexus",
    Amount: 3347
  },
  {
    id: 2,
    Car: "Buick",
    Amount: 3632
  },
  {
    id: 3,
    Car: "Dodge",
    Amount: 1464
  },
  {
    id: 4,
    Car: "MINI",
    Amount: -2887
  },
  {
    id: 5,
    Car: "Pontiac",
    Amount: 1317
  },
  {
    id: 6,
    Car: "Maserati",
    Amount: 2814
  },
  {
    id: 7,
    Car: "Scion",
    Amount: -4233
  },
  {
    id: 8,
    Car: "Infiniti",
    Amount: 2188
  },
  {
    id: 9,
    Car: "GMC",
    Amount: 4898
  },
  {
    id: 10,
    Car: "Infiniti",
    Amount: 3023
  }
];

const dataWithBalance = data.reduce((acc, obj, i) => {
  let Balance = 0;
  if (acc.length) {
    Balance = acc[acc.length-1].Balance;
  }

  return [
    ...acc,
    {
      ...obj,
      Balance: Balance + obj.Amount
    }
  ]
}, []);

const columns = [
  {
    dataKey: 'Car'
  },
  {
    dataKey: 'Amount',
    style: {
      textAlign: 'right'
    },
    render: (val, key, props) => {
      let color = 'rgba(4, 170, 53, 1)';

      if (val < 0) {
        color = 'rgba(239, 2, 9, 1)';
      }

      return (
        <span style={{ color }}>
         { val }
        </span>
      );
    }
  },
  {
    dataKey: 'Balance',
    style: {
      textAlign: 'right'
    }
  }
];

<Table
  columns={ columns }
  data={ dataWithBalance }
/>
```