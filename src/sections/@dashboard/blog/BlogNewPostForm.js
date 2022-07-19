import { useEffect, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { toast } from 'react-toastify';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//components
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';
// mrx : api links
import {
  EDIT_BLOG_BY_ID,
  CREATE_BLOG,
  UPLOAD_BLOG_COVER
} from '../../../pages/api/index';

// mrx : api
import { PostUrl, GetUrl, DeleteUrl, PutUrl } from '../../../pages/api/config';
// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm({ isEdit = false, post }) {
  const { push, query } = useRouter();
  const { id } = query;

  const USER_ID = id;

  const [open, setOpen] = useState(false);
  const [FileValue, setFileValue] = useState()

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().min(500).required('Content is required'),
    cover: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    title: post?.title,
    description: post?.description,
    content: post?.content,
    cover: process.env.HOST_API_KEY + post?.cover,
    tags: post?.tags,
    publish: post?.publish,
    // comments: true,
    metaTitle: post?.metaTitle,
    metaDescription: post?.metaDescription,
    metaKeywords: post?.metaKeywords,
  };


  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEdit && post) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, post]);

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    CreateBlogApi()
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFileValue(file)
      if (isEdit) {
        UploadBlogCoverApi(USER_ID, file);
      }
      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // mrx : Upload File ---------------------------------------------------------------------------------------------------------
  const UploadBlogCoverApi = (BlogID, FileData) => {
    let File = new FormData();
    File.append("file", !FileValue ? FileData : FileValue);
    PostUrl(UPLOAD_BLOG_COVER(BlogID),
      File
    ).then((res, err) => {
      if (res && res.status === 200) {
        if (res?.data?.isSuccess) {
          // enqueueSnackbar(res?.data?.message, { variant: 'success' });
          handleClosePreview();
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
          handleClosePreview();
        }
      } else {
        enqueueSnackbar("something went wrong !", { variant: 'error' });
      }
    });

  }

  // End -----------------------------------------------------------------------------------------------------------------------

  const CreateBlogApi = () => {
    if (isEdit) {
      PutUrl(EDIT_BLOG_BY_ID(post?.id), {
        "title": values?.title,
        "description": values?.description,
        "content": values?.content,
        "publish": values?.publish,
        "tags": values?.tags,
        "metaTitle": values?.metaTitle,
        "metaDescription": values?.metaDescription,
        "metaKeywords": values?.metaKeywords,
      }).then((res, err) => {
        if (res && res?.data?.isSuccess) {
          const Data = res?.data?.data;
          enqueueSnackbar('post Updated successfully!');
          push(PATH_DASHBOARD.blog.posts);
          // reset();
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
        }
      });
    } else {
      PostUrl(CREATE_BLOG, {
        "title": values?.title,
        "description": values?.description,
        "content": values?.content,
        "cover": "none",
        "publish": values?.publish,
        "tags": values?.tags,
        "metaTitle": values?.metaTitle,
        "metaDescription": values?.metaDescription,
        "metaKeywords": values?.metaKeywords
      }).then((res, err) => {
        if (res && res?.data?.isSuccess) {
          const Data = res?.data?.data;
          UploadBlogCoverApi(Data?.id, null)
          enqueueSnackbar('post Created successfully!');
          push(PATH_DASHBOARD.blog.posts);
          // reset();
        } else {
          enqueueSnackbar(res?.data?.message, { variant: 'error' });
        }
      });
    }

  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField name="description" label="Description" multiline rows={3} />

                <div>
                  <LabelStyle>Content</LabelStyle>
                  <RHFEditor name="content" />
                </div>

                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="publish"
                    label="Publish"
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />

                  {/* <RHFSwitch
                    name="comments"
                    label="Enable comments"
                    labelPlacement="start"
                    sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                  /> */}
                </div>

                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                />

                <RHFTextField name="metaTitle" label="Meta title" />

                <RHFTextField name="metaDescription" label="Meta description" fullWidth multiline rows={3} />

                <Controller
                  name="metaKeywords"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Meta keywords" {...params} />}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                Preview
              </Button>
              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                {
                  isEdit ? "Save" : "Post"
                }
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <BlogNewPostPreview
        values={values}
        isEdit={isEdit}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
}
