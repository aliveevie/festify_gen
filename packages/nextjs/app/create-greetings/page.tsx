"use client"

import { useState } from "react";
import CreateGreeting from "./_components/CreateGreeting";
import GreetingsList from "./_components/GreetingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

const Page = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen flex flex-col">
 
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Festival Greetings
          </h1>
          <Tabs
            defaultValue="create"
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="create">CREATE GREETING</TabsTrigger>
              <TabsTrigger value="view">MY GREETINGS</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateGreeting />
            </TabsContent>
            <TabsContent value="view">
              <GreetingsList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Page;
