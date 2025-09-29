import { Suspense } from "react";

function Inner({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <main className="container">
      <h1>Confirmación</h1>
      <div className="card">
        <p>Parámetros recibidos:</p>
        <pre>{JSON.stringify(searchParams, null, 2)}</pre>
      </div>
    </main>
  );
}

export default function ConfirmPage(props: any) {
  return (
    <Suspense>
      <Inner {...props} />
    </Suspense>
  );
}