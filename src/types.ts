import { SelectableValue } from "@grafana/data";

export type TenantFilter = Record<string, string | boolean | SelectableValue[]>;

export interface TenantDTO {
    id: number;
    tenancyName: string;
    name: string;
    editionDisplayName: string;
    connectionString: string;
    isActive: boolean;
    creationTime: string;
    subscriptionEndDateUtc: string;
    editionId: number;
    isInTrialPeriod: boolean;
  }

  export type ConfigTenantState = {
    rootUrl: string;
    userName: string;
    userPassWord: string;
  };
