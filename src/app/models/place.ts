interface Place {
  description: string;
  entertainment: Array<{
    location: Array<null>,
    name: string
  }>;
  location: Array<number>;
  name: string;
  rating: number;
  photos: Array<string>;
  price: number;
  user: {
    id: number,
    name: string,
    surname: string,
    tel: number
  };
  tags: string[];
}
