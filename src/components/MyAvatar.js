// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={process.env.HOST_API_KEY + user?.avatarUrl}
      alt={user?.firstName + " " + user?.lastName}
      color={user?.photoURL ? 'default' : createAvatar(user?.firstName + " " + user?.lastName).color}
      {...other}
    >
      {createAvatar(user?.firstName + " " + user?.lastName).name}
    </Avatar>
  );
}
