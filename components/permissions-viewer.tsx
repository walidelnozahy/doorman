export function PermissionsViewer({ permissions }: { permissions: any }) {
  return (
    <pre className=' p-4 rounded-lg overflow-auto text-sm h-[calc(100%-2rem)] border border-border'>
      {JSON.stringify(permissions, null, 2)}
    </pre>
  );
}
