import React, {useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES, MULTIFORM_PROPERTIES } from '../../constants';
import { PageFour, PageOne, PageThree, PageTwo } from '../../pages';
import { prefixRoute } from '../../utils/utils.routing';
import { AuthContextProvider } from '../../auth/AuthContext';
import { ConfigTenantState } from 'types';
import { getBackendSrv } from '@grafana/runtime';


const authOptions = {
  headers: { "content-type": "application/x-www-form-urlencoded" }
};

export function App(props: AppRootProps) {
  const [token, setToken] = useState('');
  const [configState, setConfigState] = useState<ConfigTenantState>({
    rootUrl: '',
    userName: '',
    userPassWord: ''
  });

  useEffect(() => {
    const getConfigTenant = async () => {
      const {rootUrl, userName, userPassWord} = await getBackendSrv().get(`/api/plugins/lesly-tenantmanager-app/resources/tenants/configs`);
      setConfigState(prev => ({...prev, rootUrl: rootUrl, userName: userName, userPassWord: userPassWord}))
    }
    getConfigTenant();
  },[])    
  
  useEffect(() => {
    let cycloAdminToken: any = localStorage.getItem("cycloAdminToken")
    let authData = new URLSearchParams();
    authData.append("username", configState.userName)
    authData.append("password", configState.userPassWord)
    authData.append("grant_type", MULTIFORM_PROPERTIES.GRANT_TYPE)
    authData.append("client_id", MULTIFORM_PROPERTIES.CLIENT_ID)
    authData.append("client_secret", MULTIFORM_PROPERTIES.CLIENT_SECRET)
    authData.append("scope", MULTIFORM_PROPERTIES.SCOPE)
    
    const onLoad = async () => {
      if(configState.rootUrl) {
        let response = await fetch(`${configState.rootUrl}/connect/token`, {
          method: 'POST',
          headers: authOptions.headers,
          body: authData.toString()
        });
        if(response.status === 400 || response.status === 401 || response.status === 403) {        
          response = await fetch(`${configState.rootUrl}/connect/token`, {
            method: 'POST',
            headers: authOptions.headers,
            body: authData.toString()
          });
        }
        cycloAdminToken = await response.json(); 
        localStorage.setItem("cycloAdminToken", JSON.stringify(cycloAdminToken))
        setToken(JSON.stringify(cycloAdminToken));
        localStorage.setItem("tenantRootUrl", configState.rootUrl)
      }
    }
    onLoad();

  }, [configState]);
  
  return (
    <>
      <AuthContextProvider value={token}>
        <Switch>
          <Route exact path={prefixRoute(ROUTES.Two)} component={PageTwo} />
          <Route exact path={prefixRoute(`${ROUTES.Three}/:id?`)} component={PageThree} />

          {/* Full-width page (this page will have no side navigation) */}
          <Route exact path={prefixRoute(ROUTES.Four)} component={PageFour} />

          {/* Default page */}
          <Route component={PageOne} />
        </Switch>
      </AuthContextProvider>
    </>

  );
}
