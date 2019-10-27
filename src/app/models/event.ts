interface Event {
  id: number;
  name: string;
  screen_name: string;
  place?: {
    title: string,
    latitude: number,
    longitude: number,
    address: string
  };
  description: string;
  start_date: number;
  finish_date: number;
  site: string;
  photo_50: string;
  photo_200: string;
}
