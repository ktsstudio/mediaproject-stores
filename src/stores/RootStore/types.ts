import { EndpointType } from '../../types/endpoint';

export type EndpointsType = Record<string, EndpointType> & {
  auth: EndpointType;
  getUser?: EndpointType;
  flag?: EndpointType;
};
