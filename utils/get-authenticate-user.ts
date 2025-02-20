export async function getAuthenticatedUser(supabase: any) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error('Failed to get authenticated user');
  if (!user) throw new Error('User not authenticated');

  return user;
}
