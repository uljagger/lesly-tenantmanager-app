import React, { ComponentType, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { FilterInput, HorizontalGroup, LinkButton, Pagination, VerticalGroup, useStyles2 } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { TenantsTable } from 'components/Tenant/TenantsTable';
import { TenantDTO, TenantFilter } from 'types';
import { prefixRoute } from 'utils/utils.routing';
import { ROUTES } from '../constants';


export interface FilterProps {
  filters: TenantFilter[];
  onChange: (filter: TenantFilter) => void;
  className?: string;
}
const extraFilters: Array<ComponentType<FilterProps>> = [];
export const addExtraFilters = (filter: ComponentType<FilterProps>) => {
  extraFilters.push(filter);
};


export function PageOne() {
  const styles = useStyles2(getStyles);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<TenantDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [numberItemParPage] = useState(15);
  const [skipCount, setSkipCount] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    let cycloAdminToken: any = localStorage.getItem("cycloAdminToken")
    const rootUrl =  localStorage.getItem("tenantRootUrl")

    const onLoad = async () => {
      const response = await fetch(`${rootUrl}/api/tenants?MaxResultCount=${numberItemParPage}&SkipCount=${skipCount}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Accept-Charset": "utf-8",
          Authorization: JSON.parse(cycloAdminToken).token_type + " " + JSON.parse(cycloAdminToken).access_token,
        }
      })
      const responseJson2 = await response.json();
      if(responseJson2?.items.length) {
        setFilters(responseJson2.items);
        setTotalItemCount(responseJson2.totalCount)
        setNumberOfPages(Math.ceil(totalItemCount/numberItemParPage))
      }
    }

    onLoad();

  }, [currentPage, numberItemParPage, numberOfPages, skipCount, totalItemCount]);
  

  const filterTenants = () => { 
    return filters.filter(tenant => {
      return tenant.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  function changeQuery(value: string): void {
    setQuery(value);
  }


  async function changePage(toPage: number) {
    setCurrentPage(toPage);
    const skip = (toPage * numberItemParPage) - numberItemParPage
    setSkipCount(skip);
  }

  async function removeUser(id: any): Promise<void> {
    let cycloAdminToken: any = localStorage.getItem("cycloAdminToken")
    const rootUrl =  localStorage.getItem("tenantRootUrl")

    fetch(`${rootUrl}/api/tenants/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "Accept-Charset": "utf-8",
        Authorization: JSON.parse(cycloAdminToken).token_type + " " + JSON.parse(cycloAdminToken).access_token,
      }
    })
    setFilters((filters) => filters.filter(x => x.id!==id)); 
  }

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container} className={styles.marginTop}>
        <div className="page-action-bar">
          <div className="gf-form gf-form--grow">
            <FilterInput
              placeholder="Search tenant by login or name."
              autoFocus={true}
              value={query}
              onChange={changeQuery}
            />
            {/* {extraFilters.map((FilterComponent, index) => (
              <FilterComponent key={index} filters={filters} onChange={changeFilter} className={styles.filter} />
            ))} */}
          </div>
          <LinkButton href={prefixRoute(ROUTES.Two)} variant="primary">
              Add New Tenant
          </LinkButton>
        </div>
        <VerticalGroup spacing="md">
          <TenantsTable
            tenants={filterTenants()}
            onRemoveUser={(tenant) => removeUser(tenant.id)}
          />
          <HorizontalGroup justify="flex-end">
            <Pagination
              onNavigate={changePage}
              currentPage={currentPage}
              numberOfPages={numberOfPages}
              hideWhenSinglePage={true}
            />
          </HorizontalGroup>
        </VerticalGroup>
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
  table: css`
      margin-top: ${theme.spacing(3)};
    `,
    filter: css`
      margin: 0 ${theme.spacing(1)};
    `,
    iconRow: css`
      svg {
        margin-left: ${theme.spacing(0.5)};
      }
    `,
    row: css`
      display: flex;
      align-items: center;
      height: 100% !important;

      a {
        padding: ${theme.spacing(0.5)} 0 !important;
      }
    `,
    unitTooltip: css`
      display: flex;
      flex-direction: column;
    `,
    unitItem: css`
      cursor: pointer;
      padding: ${theme.spacing(0.5)} 0;
      margin-right: ${theme.spacing(1)};
    `,
    disabled: css`
      color: ${theme.colors.text.disabled};
    `,
    link: css`
      color: inherit;
      cursor: pointer;
      text-decoration: underline;
    `,
});
