export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type SelectItem = string[];

export interface Options {
  type: string;
  name: string;
  body?: string[];
}
export interface UserInfo {
  name: string;
  lastname: string;
  number: string;
  otchestvo: string;
  car: string;
}

export interface ListInterface {
  date: string;
  time: string;
  price: string;
  count: number;
  id: string;
  arrival_place: string;
  departure_place: string;
  orderId: string;
  driver: {
    name: string;
    lastname: string;
    otchestvo: string;
    img: string;
    id: string;
  };
}
