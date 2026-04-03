export interface User {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  name: string;
  price?: string;
}

export interface ProductData {
  backpack: string;
  bikeLight: string;
  boltTShirt: string;
  fleeceJacket: string;
  onesie: string;
  redTShirt: string;
}

export interface PriceData {
  lowest: string;
  highest: string;
}

