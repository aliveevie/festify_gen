"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { Header } from "~~/components/Header";
import Hero from "~~/components/Hero";
import { Footer } from "~~/components/Footer";
import FeatureCard from "~~/components/FeatureCard";
import { Gift, Sparkles, Share2, ShieldCheck } from "lucide-react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Festival Greetings?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Create personalized greetings for all festivals and special occasions.
                Share joy with your loved ones through beautiful designs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={Gift}
                title="Personalized Greetings"
                description="Create custom greetings with personal messages for any festival or occasion."
              />
              <FeatureCard 
                icon={Sparkles}
                title="Beautiful Designs"
                description="Choose from a variety of stunning design templates for your greetings."
              />
              <FeatureCard 
                icon={Share2}
                title="Easy Sharing"
                description="Share your greetings on social media platforms with just a click."
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="Secure & Private"
                description="Your greetings are securely stored and only shared with intended recipients."
              />
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Creating and sharing festival greetings has never been easier.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Design</h3>
                <p className="text-gray-600">
                  Select from multiple beautiful design templates for your greeting card.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalize Message</h3>
                <p className="text-gray-600">
                  Add your personal message and customize the greeting to your liking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share & Celebrate</h3>
                <p className="text-gray-600">
                  Send your greeting and share the joy with your loved ones.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20" style={{ background: "linear-gradient(135deg, #a084ee 0%, #8854d0 100%)" }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Start Creating Your Greetings Today</h2>
            <p className="mb-10 max-w-2xl mx-auto text-white text-lg">
              Join thousands of users who are already spreading joy with personalized festival greetings.
            </p>
            <a 
              href="/create-greetings" 
              className="inline-block bg-white text-[#8854d0] hover:bg-gray-100 font-semibold rounded-md px-8 py-4 text-lg shadow-md transition-colors"
            >
              Create a Greeting
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
