export const UserNotification = () => (
  <>
    <div className="notification is-danger" data-cy="PostsLoadingError">
      Something went wrong!
    </div>
    <div className="notification is-warning" data-cy="NoPostsYet">
      No posts yet
    </div>
  </>
);
