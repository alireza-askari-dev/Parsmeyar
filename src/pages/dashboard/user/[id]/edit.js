import { useState, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { toast } from 'react-toastify';
// next
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../../../sections/@dashboard/user/UserForm';

// mrx : api links
import {
  GET_USER_BY_ID
} from '../../../../pages/api/index';

// mrx : api
import { PostUrl, GetAuthUrl, DeleteUrl } from '../../../../pages/api/config';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  // mrx : states
  const [UserData, setUserData] = useState({})

  const GetUserListApi = (UserID) => {
    GetAuthUrl(GET_USER_BY_ID(UserID)).then((res, err) => {
      if (res && res?.data?.isSuccess) {
        const Data = res?.data?.data;
        setUserData(Data);
      } else {
        toast.error(res?.data?.message);
      }
    });
  }

  useEffect(() => {
    GetUserListApi(id)
  }, [])

  const Name = UserData?.firstName + " " + UserData?.lastName;

  return (
    <Page title="User: Edit user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit user"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: Name },
          ]}
        />

        <UserNewForm
          isEdit
          UserData={UserData}
          setUserData={setUserData}
        />
      </Container>
    </Page>
  );
}
