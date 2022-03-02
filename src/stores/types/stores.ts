import { Method } from 'axios';

export type EndpointType = {
  url: string;
  method?: Method;
};

export type EndpointsType = Record<string, EndpointType> & {
  auth: EndpointType;
  getUser?: EndpointType;
  flag?: EndpointType;
};
