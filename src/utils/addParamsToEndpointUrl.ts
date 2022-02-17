import { EndpointType } from '../stores/types/stores';

export default function addParamsToEndpointUrl(
  { url, method }: EndpointType,
  params: string | Record<string, string>
): EndpointType {
  if (typeof params === 'string') {
    return {
      method,
      url: `${url}${params}`,
    }
  }

  const paramsAsString = Object
    .entries(params)
    .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(value)].join('='))
    .join('&');

  return {
    method,
    url: `${url}?${paramsAsString}`
  }
}