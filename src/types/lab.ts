export interface Lab {
  name: string;
  scenarios: {
    id: string;
    title: string;
    ref: string;
  }[];
}
