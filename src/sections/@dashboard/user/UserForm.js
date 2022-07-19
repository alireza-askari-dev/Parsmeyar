import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { toast } from 'react-toastify';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// mrx : api links
import {
  UPDATE_USER_BY_ID,
  CREATE_USER,
  UPLOAD_USER_PROFILE
} from '../../../pages/api/index';

// mrx : api
import { PostAuthUrl, GetUrl, DeleteUrl, PutAuthUrl } from '../../../pages/api/config';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  UserData: PropTypes.object,
};

export default function UserNewForm({
  UserData,
  isEdit = false,
  setUserData
}) {
  const { push, query } = useRouter();
  // get page id from query 
  const { id } = query;
  // page ID
  const USER_ID = id;
  // somthing like toast
  const { enqueueSnackbar } = useSnackbar();
  // States:
  const [FileData, setFileData] = useState(null)

  //#region validate form 
  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email(),
    userName: Yup.string().required('User name is required'),
    phoneNumber: Yup.number().required('Phone number is required'),
    password: isEdit ? "" : Yup.string().required('password is required'),
    // company: Yup.string().required('Company is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  //#endregion

  //#region useMemo States
  const defaultValues = useMemo(
    () => ({
      firstName: UserData?.firstName || '',
      lastName: UserData?.lastName || '',
      userName: UserData?.userName || '',
      email: UserData?.email || '',
      phoneNumber: UserData?.phoneNumber || '',
      avatarUrl: process.env.HOST_API_KEY + UserData?.avatarUrl || '',
      password: '',
      // country: UserData?.country || '',
      // state: UserData?.state || '',
      // city: UserData?.city || '',
      // zipCode: UserData?.zipCode || '',
      // isVerified: UserData?.isVerified || true,
      // status: UserData?.status,
      // company: UserData?.company || '',
      role: UserData?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [UserData]
  );
  //#endregion

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  //#region set value if edit 
  useEffect(() => {
    if (isEdit && UserData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, UserData]);

  //#endregion

  //#region  Upload File -
  const UploadUserProfile = (fileData, DataID) => {
    let File = new FormData();
    File.append("file", fileData);
    PostAuthUrl(UPLOAD_USER_PROFILE(isEdit ? USER_ID : DataID),
      File
    ).then((res, err) => {
      if (res && res.status === 200) {
        if (res?.data?.isSuccess) {
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
        }
      } else {
        toast.error("something went wrong !");
      }
    });

  }

  //#endregion

  //#region formsubmit in edit and add 
  const onSubmit = () => {
    if (isEdit) {
      PutAuthUrl(UPDATE_USER_BY_ID(USER_ID), {
        "firstName": values?.firstName,
        "lastName": values?.lastName,
        "userName": values?.userName,
        "phoneNumber": values?.phoneNumber,
        "password": values?.password,
        "role": values?.role,
      }).then((res, err) => {
        if (res && res?.data?.isSuccess) {
          const Data = res?.data?.data;
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
          push(PATH_DASHBOARD.user.list);
          // reset();
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
        }
      });
    } else {
      PostAuthUrl(CREATE_USER, {
        "firstName": values?.firstName,
        "lastName": values?.lastName,
        "userName": values?.userName,
        "phoneNumber": values?.phoneNumber,
        "email": values?.email,
        "password": values?.password,
        "role": values?.role
      }).then((res, err) => {
        if (res && res?.data?.isSuccess) {
          const Data = res?.data?.data;
          enqueueSnackbar(res?.data?.message, { variant: 'success' });
          if (FileData !== null) {
            UploadUserProfile(FileData, Data?.id)
          }
          push(PATH_DASHBOARD.user.list);
          // reset();
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
        }
      });
    }
  };

  //#endregion

  //#region drop for upload File 
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setFileData(file);
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        if (isEdit) {
          UploadUserProfile(file, null)
        }
      }
    },
    [setValue]
  );

  //#endregion

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {/* commente */}
            <>
              {/* {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )} */}
            </>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="userName" disabled={isEdit ? true : false} label="User Name" />
              <RHFTextField name="email" disabled={isEdit ? true : false} label="Email Address" />
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="phoneNumber" type="number" label="Phone Number" />
              <RHFTextField name="role" label="Role" />
              <RHFTextField name="password" label="Password" />
              {/* commented form */}
              <>
                {/* <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}

                {/* <RHFTextField name="state" label="State/Region" /> */}
                {/* <RHFTextField name="city" label="City" /> */}
                {/* <RHFTextField name="address" label="Address" /> */}
                {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
                {/* <RHFTextField name="company" label="Company" /> */}
              </>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
