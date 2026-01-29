"use client"
import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";
import { teamMembers } from "@/lib/utils/constant";

const AboutSection = () => {

  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      y: 100,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const nameVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  const linkVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.3,
      },
    },
  };

  return (
    <section id="about" className="py-20 min-h-content w-full ">
      <div className="max-w-7xl m-auto flex flex-col lg:flex-row justify-between items-center gap-16 h-full w-full">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
              Meet the Visionaries Behind Your Journey
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            We're a passionate team of travelers and technologists using AI and
            design to make trip planning effortless, inspiring adventures and
            lasting memories.
          </motion.p>

          <motion.div
          initial={{
            opacity:0,
            y:100
          }}
          transition={{
            delay:2
          }}
            
            whileInView={{
              y:0,
              opacity:1
            }}
            className="flex-1 relative"
          >
            <div className="flex justify-center flex-col items-center gap-2 lg:gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={circleVariants}
                  className="flex items-center bg-indigo-300 hover:shadow-2xl  dark:bg-indigo-950 w-full max-w-3xl  justify-between even:flex-row-reverse gap-2 rounded-lg p-4  shadow-lg relative z-30 group"
                >

                  <div className=" absolute top-0 left-0 group-even:left-100 bg-purple-600 blur-[100px] transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 w-md h-14 z-0"/>
                  {/* Circle Image */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 hover:rounded-sm rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800 mb-4 z-20"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  </motion.div>
                  {/* Name and Role */}
                  <motion.div
                    variants={nameVariants}
                    className="flex-col gap-2 flex"
                  >
                    <h3 className="text-base md:text-2xl xl:text-4xl font-bold xl:font-light text-gray-900 dark:text-white">
                      {member.name}
                    </h3>

                    {/* Social Links */}
                    <motion.div variants={linkVariants} className="flex gap-3 group-odd:justify-end">
                      <motion.a
                        href={member.linkedin}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors shadow-md"
                      >
                        <Linkedin />
                      </motion.a>
                      <motion.a
                        href={member.github}
                        whileHover={{ scale: 1.2, rotate: -5 }}
                        className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white transition-colors shadow-md"
                      >
                        <Github  />
                      </motion.a>
                      <motion.a
                        href={`mailto:${member.email}`}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors shadow-md"
                      >
                        <Mail  />
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
