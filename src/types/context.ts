export default interface Context {
  name: string;
  user: string;
  cluster: string;
  server?: string;
  namespace?: string;
}
