import React from 'react';
import { Button, LinkButton, Input, Switch, Form, Field, FieldSet, HorizontalGroup } from '@grafana/ui';
import { prefixRoute } from 'utils/utils.routing';
import { ROUTES } from '../../constants';


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

  const onSubmit = async (formData: FormModel) => {


    const jsonToken: any = localStorage.getItem("cycloAdminToken")
    console.log('result token ', jsonToken); 
    
    // post new tenant
    let createOptions = {
      url: "https://cyclosoft-admin-api.azurewebsites.net/api/tenants",
      method: "POST",
    };
    const result2 = await fetch(createOptions.url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "content-type": "application/json",
        "Accept-Charset": "utf-8",
        Authorization: JSON.parse(jsonToken).token_type + " " + JSON.parse(jsonToken).access_token,
      }
    })
    const responseJson2 = await result2.json();
    console.log('result after create new tenant ', responseJson2); 
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
                <Input {...register('adminEmailAddress', { required: true })} placeholder="email@example.com" />
              </Field>
              <Field invalid={!!errors.adminPassword} label="Password">
                <Input type='password' {...register('adminPassword', { required: true })} placeholder="" />
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
