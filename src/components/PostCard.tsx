type Props = { post: any };

export default function PostCard({ post }: Props) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-gray-800 text-sm mb-1">{post.isAnonymous ? "Anonymous" : post.user?.username}</p>
      <p className="text-lg">{post.content}</p>
      {post.mediaUrl && <img src={post.mediaUrl} alt="media" className="mt-2 rounded-md" />}
    </div>
  );
}