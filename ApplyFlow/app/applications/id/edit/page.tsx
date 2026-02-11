import Link from "next/link";

export default function ApplicationEditPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Edit application</h1>
      <p>TODO: implement application edit form.</p>
      <p>
        <Link href="/applications/id">Cancel</Link>
      </p>
    </main>
  );
}
