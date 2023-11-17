import React from 'react';
import { Button, LinkButton, Input, Switch, Form, Field, FieldSet, HorizontalGroup } from '@grafana/ui';
import { prefixRoute } from 'utils/utils.routing';
import { ROUTES } from '../../constants';
import { getAppEvents } from '@grafana/runtime';
import { AppEvents } from '@grafana/data';


export interface FormModel {
  companyName: string;
  adminName: string;
  adminEmailAddress: string;
  phoneNumber: string;
  adminFirstName: string;
  adminPassword: string;
  isSiemensEnvironment: boolean;
}

const defaultValues: FormModel = {
  companyName: '',
  adminName: '',
  adminEmailAddress: '',
  phoneNumber: '',
  adminFirstName: '',
  adminPassword: '',
  isSiemensEnvironment: false
};

export const TenantForm = () => {
  const appEvents = getAppEvents();
  const strToken = localStorage.getItem("cycloAdminToken") as string;
  const rootUrl = localStorage.getItem("tenantRootUrl") as string;
  console.log('rootUrl', rootUrl);
  console.log('strToken', strToken);

  
  const onSubmit = async (formData: FormModel) => {
    try {
      const response = await fetch(rootUrl, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
          "Accept-Charset": "utf-8",
          Authorization: JSON.parse(strToken).token_type + " " + JSON.parse(strToken).access_token,
        }
      })
  
      if(response.ok) {
        const responseToJson = await response.json();
        appEvents.publish({
          type: AppEvents.alertSuccess.name,
          payload: ["New tenant created" + ': ' + response.status + ' (' + responseToJson + ')'],
        });
      }
      
    } catch (error) {
      appEvents.publish({
        type: AppEvents.alertError.name,
        payload: ["Cannot create new tenant"] 
      });
    }
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      {({ register, control, errors }) => {
        return (
          <>
            <FieldSet>
              <Field
                invalid={!!errors.adminEmailAddress}
                error={!!errors.adminEmailAddress ? 'Email is required' : undefined}
                label="Email"
              >
                <Input type='email' {...register('adminEmailAddress', { required: true })} placeholder="email@example.com" />
              </Field>
              <Field invalid={!!errors.adminPassword} label="Password (min 8 characters)">
                <Input min={8} type='password' {...register('adminPassword', { required: true })} placeholder="" />
              </Field>
              <Field invalid={!!errors.companyName} label="Company Name">
                <Input {...register('companyName', { required: true,  })} placeholder="" />
              </Field>
              <Field invalid={!!errors.adminName} label="Admin name">
                <Input {...register('adminName', { required: true })} placeholder="" />
              </Field>
              <Field invalid={!!errors.adminFirstName} label="Admin Firstname">
                <Input {...register('adminFirstName', { required: true })} placeholder="" />
              </Field>
              <Field invalid={!!errors.phoneNumber} label="Phone Number">
                <Input {...register('phoneNumber', { required: true })} placeholder="" />
              </Field>
              <Field label="Is Mindsphere Tenant ?"> 
                <Switch id="is-mindsphere-tenant" {...register('isSiemensEnvironment')} />
              </Field>
            </FieldSet>
            <HorizontalGroup>
              <Button type="submit">Submit</Button>
              <LinkButton href={prefixRoute(ROUTES.One)} variant="secondary">
                Back
              </LinkButton>
            </HorizontalGroup>
          </>
        );
      }}
    </Form>
  );
};

export default TenantForm;
