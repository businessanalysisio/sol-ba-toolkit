import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { knowledgeArticles, knowledgeCategories } from "@/lib/data"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search articles..." className="pl-8" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {knowledgeCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {knowledgeArticles
                  .filter((article) => article.category === category.id)
                  .map((article) => (
                    <li key={article.slug}>
                      <Link href={`/knowledge-base/${article.slug}`} className="text-blue-600 hover:underline">
                        {article.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
