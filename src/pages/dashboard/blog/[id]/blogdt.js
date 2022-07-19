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

  const [post, setPost] = useState(null);

  const [error, setError] = useState(null);

  const GetUserListApi = (UserID) => {
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
    GetUserListApi(id)
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

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {post.description}
              </Typography>

              {/* <Markdown children={post} /> */}

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={post} />
                {/* <Divider /> */}
              </Box>

              <br />
              <Scrollbar>
                <Container>
                  <Box sx={{ mt: 5, mb: 10 }}>

                    <Markdown children={post?.content || ''} />
                  </Box>
                </Container>
              </Scrollbar>
              
              {/* <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="h4">Comments</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({post.comments.length})
                </Typography>
              </Box> */}

              {/* <BlogPostCommentList post={post} /> */}

              {/* <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination count={8} color="primary" />
              </Box> */}

              {/* <BlogPostCommentForm /> */}
            </Box>
          </Card>
        )}

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}

        {/* <BlogPostRecent posts={recentPosts} /> */}
      </Container>
    </Page>
  );
}
