export async function fetchPosts() {
  const resp = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!resp.ok) throw new Error('Network error');
  return resp.json();
}
