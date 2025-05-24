import { Customer } from "./InterfaceCustomer";

export interface GetCustomerResponse {
  statusCode: number;
  message: string;
  data: {
    customers: Customer[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
