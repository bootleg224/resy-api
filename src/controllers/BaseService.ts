import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

export class BaseService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private generateFullPath = (path: string) => {
    const pathToUse = (path || "").trim();
    if (pathToUse.startsWith("/")) {
      return this.baseUrl + pathToUse;
    }
    return `${this.baseUrl}/${pathToUse}`;
  };

  patch = async <T>(
    path: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await axios.patch(this.generateFullPath(path), data, config);
  };

  post = async <T>(
    path: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await axios.post(this.generateFullPath(path), data, config);
  };

  get = async <T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axios.get(this.generateFullPath(path), config);
  };

  delete = async <T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return axios.delete(this.generateFullPath(path), config);
  };
}
