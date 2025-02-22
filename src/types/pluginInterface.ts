export interface ApixPlugin {
  name: string;
  type: string;
  handler: (request: any, options?: any) => Promise<void>;
}
