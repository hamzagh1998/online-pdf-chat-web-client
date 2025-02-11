import { FiLoader } from "react-icons/fi";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MAIN_PATHES } from "@/routes/main.routes";
import { AUTH_PATHES } from "@/routes/auth.routes";
import { FaArrowRight } from "react-icons/fa";
export const Hero = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <section className="container grid xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-start space-y-6">
        <main className="text-4xl md:text-6xl font-bold">
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#f97316] via-[#ff843c] to-[#ff955d] text-transparent bg-clip-text">
              OnlinePDFChat
            </span>
            <br />
            Unlock the Power of Your Pdf Documents
          </h2>
        </main>

        <p className="text-lg md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Effortlessly interact with your PDF files. Unlock valuable insights,
          explore content, and get instant answers or summaries—all without the
          hassle. Invite participants to the conversation, collaborate
          seamlessly, and work together to uncover key information and make the
          most of your documents.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to={isAuthenticated ? MAIN_PATHES.MAIN : AUTH_PATHES.SIGNUP}>
            <Button className="w-full md:w-1/3 font-bold">
              {typeof isAuthenticated !== "boolean" ? (
                <div className="animate-spin text-xs">
                  <FiLoader size={18} />
                </div>
              ) : isAuthenticated ? (
                "Start new chat"
              ) : (
                "Get Started"
              )}
              &ensp;
              <FaArrowRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden xl:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
        <img src="illustration.png" alt="illustration img" />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
