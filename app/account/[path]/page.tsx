import { AccountView } from "@neondatabase/auth-ui";

export default async function AccountPage({
  params
}: {
  params: Promise<{ path: string }>
}
) {
  const {path} = await params;
  return <AccountView path={path} />
}