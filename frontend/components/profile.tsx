import axios from "axios";
interface User {
  name: string;
  email: string;
  avatarUrl: string;
  totalXp: number;
  currentStreak: number;
  level: string;
}
export async function Profile() {
  let user: User | null = null;
  try {
    const res = await axios.get<User>(
      "http://localhost:3000/api/profile/user-002",
    );
    user = res.data;
  } catch (error) {
    console.error("error fetching user: ", error);
  }
  if (!user) return <div>User not found</div>;
  return (
    <div>
      <h1>{user.email}</h1>
      <p>{user.name}</p>
      <p>{user.avatarUrl}</p>
      <p>{user.currentStreak}</p>
    </div>
  );
}
