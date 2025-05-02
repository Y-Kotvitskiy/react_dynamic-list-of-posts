import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { UserNotification } from './components/UserNotification';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { getUsers } from './Api/Users';
import { Post } from './types/Post';
import { getUserPosts } from './Api/Posts';
import { MessageType } from './types/MessageType';
import { MESSAGES } from './const';
import { NotificationMessage } from './types/NotificationMessage';
import { Comment } from './types/Comment';
import { deleteComment, getPostComments } from './Api/Comments';

export const App = () => {
  const [message, setMessage] = useState<NotificationMessage | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isCommentError, setIsCommentError] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (user?.id) {
      setSelectedPost(null);
      getUserPosts(user.id).then(serverPosts => {
        setPosts(serverPosts);
        if (serverPosts.length > 0) {
          setMessage(null);
        } else {
          setMessage({ text: MESSAGES.NO_POSTS, type: MessageType.Warning });
        }
      });
    } else {
      setPosts([]);
    }
  }, [user]);

  useEffect(() => {
    setIsCommentError(false);
    if (!selectedPost) {
      setComments([]);

      return;
    }

    setIsCommentLoading(true);
    if (selectedPost) {
      getPostComments(selectedPost.id)
        .then(setComments)
        .catch(() => setIsCommentError(true))
        .finally(() => setIsCommentLoading(false));
    }
  }, [selectedPost]);

  const onDeleteComment = (deletedComment: Comment) => {
    setIsCommentLoading(true);
    const deleteIndex = comments.indexOf(deletedComment);

    setComments(
      comments.filter(
        currentComment => deletedComment.id !== currentComment.id,
      ),
    );
    deleteComment(deletedComment.id)
      .catch(() => {
        setIsCommentError(true);
        comments.splice(deleteIndex, 0, deletedComment);
        setComments([...comments]);
      })
      .finally(() => setIsCommentLoading(false));
  };

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector users={users} user={user} onSelect={setUser} />
              </div>

              <div className="block" data-cy="MainContent">
                {!user && <p data-cy="NoSelectedUser">No user selected</p>}

                {false && <Loader />}

                {message && <UserNotification message={message} />}
                {posts.length > 0 && (
                  <PostsList
                    posts={posts}
                    selectedPost={selectedPost}
                    onSelect={setSelectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              'Sidebar--open',
            )}
          >
            {selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails
                  post={selectedPost}
                  comments={comments}
                  isCommentLoading={isCommentLoading}
                  isCommentError={isCommentError}
                  deleteComment={onDeleteComment}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
