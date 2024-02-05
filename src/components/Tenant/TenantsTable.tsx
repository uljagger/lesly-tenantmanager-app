import React, { useEffect, useState } from 'react';
import { Button, ConfirmModal } from '@grafana/ui';
// import { TagBadge } from 'app/core/components/TagFilter/TagBadge';
import { TenantDTO } from '../../types';


export interface Props {
  tenants: TenantDTO[];
  onRemoveUser: (user: TenantDTO) => void;
}

export const TenantsTable = ({ tenants, onRemoveUser }: Props) => {
  const [tenantToRemove, setTenantToRemove] = useState<TenantDTO | null>(null);

  useEffect(() => {

  }, []);

  return (
    <>
      <table className="filter-table form-inline">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Company name</th>
            <th>Creation Date</th>
            <th>Active</th>
            <th>Trial Period</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((user, index) => {
            // let basicRoleDisabled = !contextSrv.hasPermissionInMetadata(AccessControlAction.OrgUsersWrite, user);
            // if (config.featureToggles.onlyExternalOrgRoleSync) {
            //   const isUserSynced = user?.isExternallySynced;
            //   basicRoleDisabled = isUserSynced || basicRoleDisabled;
            // }
            return (
              <tr key={`${user.id}-${index}`}>
                <td className="max-width-6">
                  <span className="ellipsis" title={user.tenancyName}>
                    {user.tenancyName}
                  </span>
                </td>

                <td className="max-width-5">
                  <span className="ellipsis" title={user.name}>
                    {user.name}
                  </span>
                </td>
                <td className="max-width-5">
                  <span className="ellipsis" title={user.creationTime}>
                    {user.creationTime}
                  </span>
                </td>
                <td className="width-1 text-center">
                  {user.isActive && <span className="label label-tag label-tag--green">Actived</span>}
                </td>
                <td className="width-1 text-center">
                  {user.isInTrialPeriod && <span className="label label-tag label-tag--gray">Disabled</span>}
                </td>
                <td className="text-right">
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                    setTenantToRemove(user);
                    }}
                    icon="times"
                    aria-label="Delete user"
                />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {Boolean(tenantToRemove) && (
        <ConfirmModal
          body={`Are you sure you want to delete user ${tenantToRemove?.name}?`}
          confirmText="Delete"
          title="Delete"
          onDismiss={() => {
            setTenantToRemove(null);
          }}
          isOpen={true}
          onConfirm={() => {
            if (!tenantToRemove) {
              return;
            }
            onRemoveUser(tenantToRemove);
            setTenantToRemove(null);
          }}
        />
      )}
    </>
  );
};
