import StorageManager from "@/components/StorageManager";

export default function SettingsPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>Manage storage and system preferences.</p>
        </div>
      </div>
      <StorageManager />
    </>
  );
}