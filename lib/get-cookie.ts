import { cookies } from "next/headers";

export const getCookie = (name: string) => {
  const cookieStore = cookies();
  const domain = cookieStore.get(name);

  if (!domain) {
    return null;
  }

  return domain.value;
};
