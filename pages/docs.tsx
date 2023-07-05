import { useState } from "react";
import { NextPage } from "next";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import LoadingDots from "@/components/LoadingDots";
import ResizablePanel from "@/components/ResizablePanel";
import MetaTags from "@/components/MetaTags";
import { PageMeta } from "../types";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { SearchIcon } from "@heroicons/react/outline";


interface Props {
  children: React.ReactNode;
  meta?: PageMeta;
}

const DocsPage: NextPage<Props> = ({ children, meta: pageMeta }: Props) => {
  const [loading, setLoading] = useState(false);
  const [userQ, setUserQ] = useState("");
  const [answer, setAnswer] = useState("");

  const generateAnswer = async (e: any) => {
    e.preventDefault();
    if (!userQ) {
      return toast.error("Please enter a question!");
    }

    setAnswer("");
    setLoading(true);
    const response = await fetch("/api/docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: userQ
      })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer(prev => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <>
      <MetaTags
        title="ConstitutionGPT"
        description="ConstitutionGPT"
        cardImage="/Users/vdutts7/Documents/constitutionGPT/public/favicon.ico"
        url=""
      />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
        <main className="flex flex-col items-center justify-center flex-1 w-full min-h-screen px-4 py-2 mx-auto mt-12 text-center sm:mt-20">
   
          <div className="w-full max-w-5xl">
            <form onSubmit={generateAnswer} className="flex items-center">
              <label htmlFor="question" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 ml-4 h-5 text-gray-400" aria-hidden="true" />
                </div> */}
                <input
                  type="text"
                  name="question"
                  value={userQ}
                  onChange={e => setUserQ(e.target.value)}
                  className="block w-full pl-10 pr-3 py-5 bg-[#ffffff] glassy hover:bg-[#000440] hover:bg-opacity-70 border opacity-100 hover:opacity-60 border-gray-300 hover:border-gray-300 rounded-md shadow-sm placeholder-gray-400 glassy focus:outline-none focus:border-white-400 text-base focus:bg-white-500 focus:bg-opacity-80"
  placeholder="Ask about the Constitution...."
                />
              </div>
              <button
                type="submit"
                className="mr-2 ml-3 glassy inline-flex bg-[#000440] items-center px-9 py-5 border border-transparent bg-[#000440] rounded-md shadow-sm text-base font-medium text-white hover:bg-[#000440] focus:bg-[#000440] focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {loading && (
                  <LoadingDots color="white" style="sm" />
                )}
                Ask!
              </button>
            </form>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            <ResizablePanel>
              <AnimatePresence mode="wait">
                <motion.div className="my-10 space-y-10">
                  {answer && (
                    <>
                      {answer.split("SOURCES:").map((splitanswer, index) => {
                        return (
                          <div
                            className={`p-4 transition bg-neutral border border-neutral-focus shadow-md rounded-xl overflow-x-auto max-w-xl ${
                              index === 0
                                ? "hover:border-[#000440]-focus cursor-copy text-left"
                                : ""
                            }`}
                            onClick={() => {
                              if (index === 0) {
                                navigator.clipboard.writeText(splitanswer);
                                toast("Copied to clipboard!", {
                                  icon: "✂️"
                                });
                              }
                            }}
                            key={uuidv4()}
                          >
                            {index === 0 ? (
                              <MarkdownRenderer content={splitanswer.trim()} />
                            ) : null}
                          </div>
                        );
                      })}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </ResizablePanel>
          </div>
        </main>
      </div>
    </>
  );
};

export default DocsPage;