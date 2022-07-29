import { Method } from 'axios';

type EndpointType = {
  url: string;
  method?: Method;
};

export { EndpointType };
