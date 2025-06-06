import { notFound } from "next/navigation";
import EditGuidelineClient from "./EditGuidelineClient";

// Define the shape of the resolved params
type ResolvedParams = {
  id: string;
};

// Define the shape of resolved search params
type ResolvedSearchParams = { [key: string]: string | string[] | undefined };

// Define the props for the page, where params and searchParams are Promises
type EditPageProps = {
  params: Promise<ResolvedParams>;
  searchParams?: Promise<ResolvedSearchParams>; // searchParams is also a Promise
};

// This is a server component that receives the route parameters
export default async function EditGuidelinePage({
  params: paramsPromise,
  searchParams: searchParamsPromise, // Destructure as a promise
}: EditPageProps) {
  const resolvedParams = await paramsPromise; // Await the params promise
  const id = resolvedParams.id;

  // If searchParams were needed, you would await searchParamsPromise here:
  // const resolvedSearchParams = searchParamsPromise ? await searchParamsPromise : undefined;

  // Validate the ID parameter
  if (!id) {
    return notFound();
  }

  // Return the client component with the ID parameter
  return <EditGuidelineClient id={id} />;
}
