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

          <h1 className="mx-auto mb-4 text-white text-center max-w-4xl font-display text-5xl opacity-70 tracking-normal sm:text-2xl text-shadow">
            <span className="relative whitespace-nowrap ">
              <i>Constitution GPT</i> 
            </span>
          </h1>

            <form onSubmit={generateAnswer} className="flex items-center">
              <label htmlFor="question" className="sr-only">
                Search
              </label>





              <div className="relative w-full">
                <input
                  type="text"
                  name="question"
                  value={userQ}
                  onChange={e => setUserQ(e.target.value)}
                  className="block w-full pl-10 pr-1 py-5  glassy hover:bg-opacity-80  border border-transparent border-gray-300 hover:border-white-300 rounded-md shadow-sm placeholder-white focus:outline-none focus:border-white-400 text-base focus:bg-[#000440]-600 focus:bg-opacity-80"
  placeholder="Ask about the Constitution...."
                />
              </div>
              <button
                type="submit"
                className="mr-2 ml-3 inline-flex bg-[#000440] items-center px-9 py-5 border border-transparent border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-[#000440] focus:bg-[#000440] focus:outline-2 focus:ring-2 focus:ring-offset-2"
              >
                {loading && (
                  <LoadingDots color="red" style="sm" />
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
                <motion.div className="my-10 space-y-10 rounded-md w-full">
                  {answer && (
                    <>
                      {answer.split("SOURCES:").map((splitanswer, index) => {
                        return (
                          <div
                            className={`p-4 transition glassy4 bg-[#000440] border border-neutral-focus shadow-md rounded-xl overflow-x-auto max-w-5xl ${
                              index === 0
                                ? "hover:border-[#000440]-focus cursor-copy text-left"
                                : ""
                            }`}
                            
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