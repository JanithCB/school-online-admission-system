import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const highlights = [
  "Paperless application process",
  "Instant status tracking",
  "Secure document submission",
  "Responses within 5 business days",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-6">
            Academic Year 2025–2026
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
            Admissions are <br />
            <span className="border-b-4 border-[#1a1a1a]">now open.</span>
          </h1>
          <p className="text-lg text-[#555550] leading-relaxed mb-10 max-w-xl">
            Apply online for grades 1 through 12. Our application process is
            straightforward — fill in your details, upload the required documents,
            and submit. No appointments needed.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/apply">
              <Button className="bg-[#1a1a1a] text-white hover:bg-[#333] h-12 px-8 text-sm font-semibold rounded-md gap-2">
                Start Application <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="outline" className="h-12 px-8 text-sm font-semibold rounded-md border-[#d0d0ca] text-[#1a1a1a] hover:bg-[#f5f5f2]">
                View All Submissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="h-px bg-[#e5e5e0]" />
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#888882] mb-4">
              What we offer
            </p>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              A simple process for a <br /> important decision.
            </h2>
            <p className="text-[#555550] leading-relaxed">
              Our online admission portal is designed for clarity. You fill a form,
              upload your documents, and our team reviews each application carefully.
              Admissions are free of bias and based purely on available seats and
              grade eligibility.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#1a1a1a] mt-0.5 flex-shrink-0" />
                <span className="text-[#333330] text-sm leading-relaxed">{item}</span>
              </div>
            ))}

            <div className="pt-4 grid grid-cols-2 gap-4">
              {[
                { label: "Grades", value: "1 – 12" },
                { label: "Applications", value: "Online Only" },
                { label: "Decision Time", value: "≤ 5 Days" },
                { label: "Cost", value: "Free" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 border border-[#e5e5e0] rounded-md bg-white">
                  <div className="text-xl font-bold text-[#1a1a1a]">{stat.value}</div>
                  <div className="text-xs text-[#888882] mt-1 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-semibold mb-1">Ready to apply?</p>
            <p className="text-[#aaa] text-sm">Applications take less than 5 minutes to complete.</p>
          </div>
          <Link href="/apply">
            <Button className="bg-white text-[#1a1a1a] hover:bg-[#f0efea] h-11 px-8 text-sm font-semibold rounded-md gap-2">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
