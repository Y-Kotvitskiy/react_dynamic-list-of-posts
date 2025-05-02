import React from 'react';
import classNames from 'classnames';
import { Post } from '../types/Post';

interface PostsListProps {
  posts: Post[];
  selectedPostId: Post['id'] | null;
  onSelect: (postId: Post['id'] | null) => void;
}

export const PostsList: React.FC<PostsListProps> = ({
  posts,
  selectedPostId,
  onSelect,
}) => (
  <div data-cy="PostsList">
    <p className="title">Posts:</p>

    <table className="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr className="has-background-link-light">
          <th>#</th>
          <th>Title</th>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <th> </th>
        </tr>
      </thead>

      <tbody>
        {posts.map(({ id, title }: Post) => (
          <tr key={id} data-cy="Post">
            <td data-cy="PostId">{id}</td>

            <td data-cy="PostTitle">{title}</td>

            <td className="has-text-right is-vcentered">
              <button
                type="button"
                data-cy="PostButton"
                className={classNames('button', 'is-link', {
                  'is-light': id !== selectedPostId,
                })}
                onClick={() => onSelect(id === selectedPostId ? null : id)}
              >
                {id === selectedPostId ? 'Close' : 'Open'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
