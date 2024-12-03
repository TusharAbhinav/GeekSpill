import { Suspense } from "react";
import FeedContent from "./extract-feed-content";
import Loading from "./loading";

type Params = {
  categoryName: string;
  companyName: string;
  id: string;
};

export default function CategoryBlogPage({ params }: { params: Params }) {
  return (
      <Suspense fallback={<Loading />}>
        <FeedContent params={params} />
      </Suspense>
  );
}
