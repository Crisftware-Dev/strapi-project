import { fetchUser } from "@/lib/api";

export default async function User() {

  const user = await fetchUser();
  return <p>{user.username}</p>;
}
