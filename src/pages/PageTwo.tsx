import React from 'react';
import { testIds } from '../components/testIds';
import { PluginPage } from '@grafana/runtime';
import { TenantForm } from 'components/Tenant/TenantForm';


const pageNav = {
  text: 'Create new Tenant',
  description: 'Incident timeline and details'
};

export function PageTwo() {
  return (
    <PluginPage  pageNav={pageNav}>
      <div data-testid={testIds.pageTwo.container}>
        {/* <p>This is page two.</p> */}
        <TenantForm />
      </div>
    </PluginPage>
  );
}
