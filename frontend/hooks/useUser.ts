import { fetchUser } from "@/lib/endpoint-api";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCurrentUser() {
  const { data: user } = useUser();

  const nameAndLastname =
    user?.fullname
      ?.split(" ")[0]
      .concat(" ", user?.lastname?.split(" ")[0])
      ?.toUpperCase() || "";

  const initials = nameAndLastname
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return { nameAndLastname, initials }
}