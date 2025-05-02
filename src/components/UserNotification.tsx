import { NotificationMessage } from '../types/NotificationMessage';

interface UserNotificationProps {
  message: NotificationMessage;
}

export const UserNotification: React.FC<UserNotificationProps> = ({
  message,
}) => {
  const { text, type } = message;

  return (
    <div className={`notification ${type}`} data-cy="PostsLoadingError">
      {text}
    </div>
  );
};
