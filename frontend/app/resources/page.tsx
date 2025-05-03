import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink, FileText, Globe, GraduationCap, Video } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">MUN Resources</h1>
        <p className="mt-4 text-lg text-gray-600">
          Curated resources to help you prepare for your Model UN experience.
        </p>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="guides">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
            <TabsTrigger value="research">Research Resources</TabsTrigger>
            <TabsTrigger value="rules">Rules & Procedures</TabsTrigger>
            <TabsTrigger value="videos">Video Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guides & Tutorials</CardTitle>
                <CardDescription>Essential guides for delegates of all experience levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Beginner's Guide to Model UN",
                      description: "A comprehensive introduction to Model UN for first-time delegates.",
                      url: "https://bestdelegate.com/model-un-for-beginners/",
                      tags: ["Beginner", "Overview"],
                    },
                    {
                      title: "How to Write a Position Paper",
                      description: "Step-by-step guide to writing an effective position paper.",
                      url: "https://bestdelegate.com/how-to-write-a-position-paper/",
                      tags: ["Writing", "Preparation"],
                    },
                    {
                      title: "Public Speaking in Model UN",
                      description: "Tips and techniques for effective public speaking in committee sessions.",
                      url: "https://bestdelegate.com/public-speaking-in-model-un/",
                      tags: ["Speaking", "Skills"],
                    },
                    {
                      title: "Resolution Writing Guide",
                      description: "Learn how to draft and structure effective resolutions.",
                      url: "https://bestdelegate.com/resolution-writing-guide/",
                      tags: ["Writing", "Advanced"],
                    },
                    {
                      title: "Negotiation Strategies",
                      description: "Advanced techniques for successful negotiation in committee sessions.",
                      url: "https://bestdelegate.com/negotiation-strategies/",
                      tags: ["Diplomacy", "Advanced"],
                    },
                  ].map((resource, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            <Link
                              href={resource.url}
                              className="flex items-center hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Resources</CardTitle>
                <CardDescription>
                  Valuable sources for researching countries, topics, and international relations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "United Nations Official Website",
                      description: "Access official UN documents, resolutions, and information.",
                      url: "https://www.un.org/",
                      tags: ["Official", "Primary Source"],
                    },
                    {
                      title: "CIA World Factbook",
                      description:
                        "Comprehensive country profiles with demographic, economic, and political information.",
                      url: "https://www.cia.gov/the-world-factbook/",
                      tags: ["Country Profiles", "Data"],
                    },
                    {
                      title: "BBC Country Profiles",
                      description:
                        "Up-to-date information on countries' politics, history, and international relations.",
                      url: "https://www.bbc.com/news/world",
                      tags: ["News", "Country Profiles"],
                    },
                    {
                      title: "Security Council Report",
                      description:
                        "Independent organization that provides information about Security Council activities.",
                      url: "https://www.securitycouncilreport.org/",
                      tags: ["Security Council", "Analysis"],
                    },
                    {
                      title: "UN Digital Library",
                      description: "Search for official UN documents, voting records, and resolutions.",
                      url: "https://digitallibrary.un.org/",
                      tags: ["Documents", "Research"],
                    },
                  ].map((resource, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            <Link
                              href={resource.url}
                              className="flex items-center hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Globe className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rules & Procedures</CardTitle>
                <CardDescription>Resources for understanding parliamentary procedure and MUN rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Standard MUN Rules of Procedure",
                      description: "Comprehensive guide to standard Model UN rules of procedure.",
                      url: "https://www.unausa.org/model-un/conference-preparation/rules-of-procedure/",
                      tags: ["Procedure", "Essential"],
                    },
                    {
                      title: "Points and Motions Guide",
                      description: "Detailed explanation of all points and motions used in Model UN.",
                      url: "https://bestdelegate.com/model-un-made-easy-points-and-motions/",
                      tags: ["Procedure", "Reference"],
                    },
                    {
                      title: "Voting Procedures Explained",
                      description: "Guide to understanding voting procedures in different committees.",
                      url: "https://bestdelegate.com/voting-procedure-explained/",
                      tags: ["Voting", "Procedure"],
                    },
                    {
                      title: "Security Council Rules",
                      description: "Specialized rules for Security Council simulations.",
                      url: "https://www.un.org/securitycouncil/content/procedures",
                      tags: ["Security Council", "Specialized"],
                    },
                    {
                      title: "Crisis Committee Procedures",
                      description: "Guide to the unique procedures used in crisis committees.",
                      url: "https://bestdelegate.com/crisis-committees-explained/",
                      tags: ["Crisis", "Advanced"],
                    },
                  ].map((resource, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            <Link
                              href={resource.url}
                              className="flex items-center hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Resources</CardTitle>
                <CardDescription>Video tutorials and recordings to help you prepare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Model UN Explained",
                      description: "A comprehensive introduction to Model UN for beginners.",
                      url: "https://www.youtube.com/watch?v=example1",
                      tags: ["Beginner", "Overview"],
                    },
                    {
                      title: "Public Speaking Tips for MUN",
                      description: "Improve your public speaking skills for committee sessions.",
                      url: "https://www.youtube.com/watch?v=example2",
                      tags: ["Speaking", "Skills"],
                    },
                    {
                      title: "How to Research for Model UN",
                      description: "Effective research strategies for Model UN preparation.",
                      url: "https://www.youtube.com/watch?v=example3",
                      tags: ["Research", "Preparation"],
                    },
                    {
                      title: "Resolution Writing Tutorial",
                      description: "Step-by-step guide to writing effective resolutions.",
                      url: "https://www.youtube.com/watch?v=example4",
                      tags: ["Writing", "Advanced"],
                    },
                    {
                      title: "Sample Committee Session",
                      description: "Watch a recorded committee session to understand the flow.",
                      url: "https://www.youtube.com/watch?v=example5",
                      tags: ["Simulation", "Example"],
                    },
                  ].map((resource, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            <Link
                              href={resource.url}
                              className="flex items-center hover:text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {resource.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Video className="h-6 w-6 text-red-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12 rounded-lg bg-slate-50 p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 sm:mb-0">
            <GraduationCap className="h-8 w-8 text-slate-700" />
          </div>
          <div className="sm:ml-6">
            <h2 className="text-xl font-bold text-gray-900">Need More Resources?</h2>
            <p className="mt-2 text-gray-600">
              If you need additional resources or have specific questions about Model UN preparation, please contact our
              academic team or check our FAQ section.
            </p>
            <div className="mt-4">
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline">
                Contact Academic Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
