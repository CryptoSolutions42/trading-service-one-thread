import axios from 'axios';

import { BehaviorRequest, OptionsRequest } from '../../types/types';
import { IHttpService } from '../../interfaces/IHttpService';

export class HttpService implements IHttpService {
  private _baseUrl: string;

  constructor(url: string) {
    this._baseUrl = url;
  }
  //TODO: fixing this syntacss
  async get<T>(url: string, options?: OptionsRequest): Promise<T> {
    return await (
      await axios.get<T>(url, options)
    ).data;
  }

  async post<T>(url: string, options?: OptionsRequest): Promise<T> {
    return await (
      await axios.post<T>(url, options)
    ).data;
  }

  async put<T>(url: string, options?: OptionsRequest): Promise<T> {
    return await (
      await axios.put<T>(`${this._baseUrl}/${url}`, options)
    ).data;
  }
}
