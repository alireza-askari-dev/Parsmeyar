import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';
import { toast } from 'react-toastify';
// next
import NextLink from 'next/link';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Typography, CardContent, Link, Grid, Stack, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import TextMaxLine from '../../../components/TextMaxLine';
import SvgIconStyle from '../../../components/SvgIconStyle';
import TextIconLabel from '../../../components/TextIconLabel';
import BlogMoreMenu from './BlogMoreMenu';

// mrx : api links
import {
  DELETE_BLOG_BY_ID
} from '../../../pages/api/index';

// mrx : api
import { PostUrl, GetUrl, DeleteUrl } from '../../../pages/api/config';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ setPosts, AllData, post, index }) {
  const isDesktop = useResponsive('up', 'md');

  const { cover, title, view, comment, share, author, createdAt } = post;

  const latestPost = index === 0 || index === 1 || index === 2;

  const { enqueueSnackbar } = useSnackbar();

  const deleteBlog = (BlogID) => {
    DeleteUrl(DELETE_BLOG_BY_ID(BlogID)).then((res, err) => {
      if (res && res?.data?.isSuccess) {
        setPosts(AllData?.filter((item) => item?.id !== BlogID));
        enqueueSnackbar(res?.data?.message, { variant: 'success' });
      } else {
        enqueueSnackbar(res?.data?.message, { variant: 'error' });
      }
    });
  }

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Grid style={{
          position: "absolute",
          zIndex: "111",
          right: "10px",
          top: "10px",
        }}>
          <BlogMoreMenu onDelete={deleteBlog} id={post.id} />
        </Grid>
        {/* <Avatar
          // alt={title}
          // src={title}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute',
          }}
        /> */}
        <PostContent
          title={title}
          view={view}
          comment={comment}
          share={share}
          createdAt={createdAt}
          index={index}
          id={post?.id}
        />
        <OverlayStyle />
        <Image alt="cover" src={process.env.HOST_API_KEY + cover} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card>
      <Grid style={{
        position: "absolute",
        zIndex: "111",
        right: "10px",
        top: "10px",
      }}>
        <BlogMoreMenu onDelete={deleteBlog} id={post.id} />
      </Grid>
      <Box sx={{ position: 'relative' }}>
        {/* <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          // alt={author.name}
          // src={author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            width: 32,
            height: 32,
            bottom: -16,
            position: 'absolute',
          }}
        /> */}
        <Image alt="cover" src={process.env.HOST_API_KEY + cover} ratio="4/3" />
      </Box>

      <PostContent
        title={title}
        view={view}
        comment={comment}
        share={share}
        createdAt={createdAt}
        id={post?.id}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  comment: PropTypes.number,
  createdAt: PropTypes.string,
  index: PropTypes.number,
  share: PropTypes.number,
  title: PropTypes.string,
  view: PropTypes.number,
};

export function PostContent({ id, title, view, comment, share, createdAt, index }) {
  const isDesktop = useResponsive('up', 'md');

  const linkTo = `${PATH_DASHBOARD.blog.root}/${paramCase(id)}/blogdt`;

  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  const POST_INFO = [
    { number: comment, icon: 'eva:message-circle-fill' },
    { number: view, icon: 'eva:eye-fill' },
    { number: share, icon: 'eva:share-fill' },
  ];

  return (
    <CardContent
      sx={{
        pt: 4.5,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }),
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {fDate(createdAt)}
      </Typography>

      <NextLink href={linkTo} passHref>
        <Link color="inherit">
          <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
            {title}
          </TextMaxLine>
        </Link>
      </NextLink>

      <Stack
        flexWrap="wrap"
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: 3,
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white',
          }),
        }}
      >
        {POST_INFO.map((info, index) => (
          <TextIconLabel
            key={index}
            icon={<Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />}
            value={fShortenNumber(info.number)}
            sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
          />
        ))}
      </Stack>
    </CardContent>
  );
}
