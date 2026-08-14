import { notFound } from "next/navigation"
import { knowledgeArticles } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = knowledgeArticles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/knowledge-base" passHref>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Knowledge Base</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{article.title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>Category: {article.category}</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardContent>
      </Card>
    </div>
  )
}
