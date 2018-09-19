import axios, {
  AxiosAdapter,
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Cancel,
  Canceler,
  CancelToken,
  CancelTokenSource,
} from 'axios'
import config from './config'
import { IIPinfo } from './model/ipinfo.interface';

export default class IPinfoWrapper {
  constructor(private url: string, private token: string) {
    this.url = url
    this.token = token
  }

  public getInfo(): any {
    axios
      .get(this.url + config.TokenPrefixL + this.token)
      .then((response: AxiosResponse) => {
        // return response.data as IIPinfo;
        const {data} = response;
        return data as IIPinfo;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else {
          console.log(error.message)
        }
      })
  }
}
