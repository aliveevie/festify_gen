import Link from "next/link";
import { useEffect, useState } from "react";

const greetings = [
  {
    title: "Happy Diwali!",
    message: "May the festival of lights bring joy, prosperity, and happiness to your life.",
    from: "Your Friend",
  },
  {
    title: "Happy New Year!",
    message: "Wishing you a year filled with new hopes, joys, and beginnings.",
    from: "Jane Doe",
  },
  {
    title: "Special Greetings!",
    message: "Sending you warm wishes and lots of love on this special day.",
    from: "John Smith",
  },
  {
    title: "Festival Wishes!",
    message: "Celebrate every moment and cherish the memories with your loved ones.",
    from: "Festify Team",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % greetings.length);
        setFade(true);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const greeting = greetings[index];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#8854d0]">
            Celebrate<br />
            Special Moments with<br />
            Personalized Greetings
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Create beautiful festival greetings and share them with your loved ones. 
            Customize designs, add personal messages, and spread joy through blockchain.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-greetings" passHref legacyBehavior>
              <a className="bg-[#8854d0] hover:bg-[#7c47c2] text-white px-8 py-4 text-lg rounded-md font-semibold transition-colors shadow-md">Create a Greeting</a>
            </Link>
            <Link href="/about" passHref legacyBehavior>
              <a className="border-2 border-[#8854d0] text-[#8854d0] hover:bg-[#f3eaff] px-8 py-4 text-lg rounded-md font-semibold transition-colors">Learn More</a>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div
              className="w-80 md:w-96 h-96 md:h-[450px] rounded-2xl shadow-2xl border border-white/30 p-8 flex flex-col items-center justify-center text-white relative z-10 bg-gradient-to-br from-[#a084ee] to-[#8854d0]"
              style={{ boxShadow: '0 8px 32px 0 rgba(136,84,208,0.25), 0 1.5px 8px 0 #a084ee' }}
            >
              {/* Glowing Dots */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_2px_rgba(168,132,238,0.5)]"></div>
              <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_2px_rgba(168,132,238,0.5)]"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_2px_rgba(168,132,238,0.5)]"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_2px_rgba(168,132,238,0.5)]"></div>
              {/* Animated Greeting Content */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center space-y-6">
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-2 drop-shadow-lg">{greeting.title}</h3>
                  <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-sm max-w-xs mx-auto">{greeting.message}</p>
                  <p className="text-base text-white/70 pt-4 font-semibold">From: {greeting.from}</p>
                </div>
              </div>
              {/* Decorative gradient ring */}
              <div className="absolute -inset-2 rounded-3xl pointer-events-none" style={{ boxShadow: '0 0 32px 8px #a084ee33, 0 0 0 2px #fff2' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 