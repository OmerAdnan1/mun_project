import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, BookOpen, Calendar, CheckCircle, Globe, Users } from "lucide-react"
import Image from "next/image"
import { FeaturedCommittees } from "@/components/featured-committees"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-20 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Model United Nations</span>
              <span className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              A comprehensive platform for organizing, participating in, and managing Model UN conferences with ease and
              efficiency.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/committees">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Committees
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Our MUN Platform</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our Model United Nations Management System provides a comprehensive solution for organizing and
              participating in MUN conferences. From registration to committee sessions, we streamline the entire
              process.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Delegate Management</h3>
              <p className="mt-2 text-base text-gray-600">
                Streamlined registration, committee assignments, and performance tracking for delegates.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Committee Organization</h3>
              <p className="mt-2 text-base text-gray-600">
                Efficient committee setup, topic management, and country allocation.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Performance Evaluation</h3>
              <p className="mt-2 text-base text-gray-600">
                Comprehensive scoring system, attendance tracking, and award determination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why Choose Our Platform</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our system offers numerous benefits for organizers, chairs, and delegates alike.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <CheckCircle className="h-6 w-6 text-green-500" />,
                title: "Streamlined Registration",
                description: "Simple multi-step registration process for delegates and chairs.",
              },
              {
                icon: <Calendar className="h-6 w-6 text-blue-500" />,
                title: "Efficient Scheduling",
                description: "Manage conference schedules, sessions, and events with ease.",
              },
              {
                icon: <BookOpen className="h-6 w-6 text-purple-500" />,
                title: "Resource Management",
                description: "Centralized repository for study guides, position papers, and resources.",
              },
              {
                icon: <Users className="h-6 w-6 text-orange-500" />,
                title: "Delegate Tracking",
                description: "Monitor delegate performance, attendance, and participation.",
              },
              {
                icon: <Award className="h-6 w-6 text-red-500" />,
                title: "Award System",
                description: "Transparent scoring and award determination process.",
              },
              {
                icon: <Globe className="h-6 w-6 text-teal-500" />,
                title: "Global Accessibility",
                description: "Access the platform from anywhere, anytime.",
              },
            ].map((benefit, index) => (
              <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-center">
                  {benefit.icon}
                  <h3 className="ml-2 text-lg font-medium text-gray-900">{benefit.title}</h3>
                </div>
                <p className="mt-4 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secretary General's Letter */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-xl sm:p-12">
            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
              <div className="mb-6 flex-shrink-0 md:mb-0">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Secretary General"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Letter from the Secretary General</h2>
                <p className="mt-4 text-gray-300">Dear Delegates and Faculty Advisors,</p>
                <p className="mt-2 text-gray-300">
                  It is with great pleasure that I welcome you to our Model United Nations conference. Our team has
                  worked tirelessly to create an engaging and educational experience for all participants. This platform
                  will help streamline your participation and ensure a smooth conference experience.
                </p>
                <p className="mt-2 text-gray-300">
                  We look forward to seeing your active participation and diplomatic skills in action.
                </p>
                <p className="mt-4 font-medium">
                  Sincerely,
                  <br />
                  Jane Doe
                  <br />
                  Secretary General
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Committees */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Committees</h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore some of our highlighted committees for the upcoming conference.
            </p>
          </div>
          <div className="mt-12">
            <FeaturedCommittees />
          </div>
          <div className="mt-10 text-center">
            <Link href="/committees">
              <Button size="lg" className="bg-slate-800 text-white hover:bg-slate-700">
                View All Committees
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
