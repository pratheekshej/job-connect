import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/home-bg.jpg'; // Import  background image
import Anime from "./shared/Anime";
import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [typing, setTyping] = useState(""); // Initialize with the first letter

  const typingText = "Connecting Talent with Opportunity!";

  const searchJobHandler = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  // Typing effect logic
  useEffect(() => {
    let index = 0, typingTimeout;
    const typeCharacter = () => {
      if (index < typingText.length) {
        let textChar = typingText.slice(index, index + 1);
        if (!textChar) {
          clearTimeout(typingTimeout);
          return;
        }
        setTyping((prev) => (prev + textChar));
        index += 1;
        setTimeout(typeCharacter, 100);
      } else {
        clearTimeout(typingTimeout);
      }
    };
    typingTimeout = setTimeout(typeCharacter, 100);
    return () => clearTimeout(typingTimeout);
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center bg-cover bg-center min-h-[70vh]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Anime>
        <div className="bg-black bg-opacity-80 shadow-lg p-8 rounded-lg text-center">
          <span className="block bg-[#005477] mx-auto px-1 py-2 rounded-full font-semibold text-lg text-white tracking-widest">
            {typing}
          </span>
          <h1 className="mt-4 font-bold text-5xl text-white">
            Search, Apply & <br /> Get Your{" "}
            <span className="text-[#00BFFF]">Dream Jobs</span>
          </h1>

          <form className="flex justify-center mt-6" onSubmit={searchJobHandler}>
            <input
              type="text"
              className="px-4 py-2 rounded-l-full w-96"
              placeholder="Search for jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="flex items-center bg-[#005477] hover:bg-[#004B6D] px-4 py-2 rounded-r-full text-white transition duration-300"
            >
              <Search className="mr-2" />
            </Button>
          </form>
        </div>
      </Anime>
    </div>
  );
};

export default HeroSection;
