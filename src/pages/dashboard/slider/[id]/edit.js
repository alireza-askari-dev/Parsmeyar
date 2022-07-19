import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { sentenceCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Card, Divider, Container, Typography, Pagination } from '@mui/material';
import Scrollbar from '../../../../components/Scrollbar';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { BlogNewPostForm } from '../../../../sections/@dashboard/blog';
// utils
import axios from '../../../../utils/axios';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import Markdown from '../../../../components/Markdown';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../../../../components/skeleton';
// sections
import {
  BlogPostHero,
  BlogPostTags,
  BlogPostRecent,
  BlogPostCommentList,
  BlogPostCommentForm,
} from '../../../../sections/@dashboard/blog';

// mrx : api links
import {
  GET_BLOG_BY_ID
} from '../../../api/index';

// mrx : api
import { PostUrl, GetUrl, DeleteUrl } from '../../../api/config';

// ----------------------------------------------------------------------

BlogPost.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const { query } = useRouter();

  const { id } = query;

  const [recentPosts, setRecentPosts] = useState([]);

  const [post, setPost] = useState({});

  const [error, setError] = useState(null);

  const GetBlogsListApi = (UserID) => {
    GetUrl(GET_BLOG_BY_ID(UserID)).then((res, err) => {
      if (res && res?.data?.isSuccess) {
        const Data = res?.data?.data;
        setPost(Data);
      } else {
        setError(res?.data?.message);
      }
    });
  }

  useEffect(() => {
    GetBlogsListApi(id)
  }, [id])

  return (
    <Page title="Blog: Post Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: post?.title },
          ]}
        />

        <BlogNewPostForm
          isEdit
          post={post}
          setPost={setPost}
        />

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
