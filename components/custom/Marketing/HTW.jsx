"use client"

import { motion } from "framer-motion";

import { planSteps } from "@/lib/utils/constant";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const HTW = () => {
  return (
   <section className="py-20 px-6 relative overflow-hidden " id="htw">
        <div className="max-w-7xl mx-auto px-4 min-h-screen flex flex-col gap-24">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Your Trip in 3 Easy Steps
            </h2>
            <p className="text-base tracking-widest text-gray-600 dark:text-gray-300">
              From inspiration to itinerary in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 z-20 relative">
            {planSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="text-7xl font-bold text-blue-400 dark:text-gray-700 mb-4">
                  {item.step}
                </div>
                <div className="bg-slate-200 group-hover:bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-[70%] transition duration-300 ease-in-out group-hover:-translate-y-3 relative overflow-hidden">
                  <div className=" absolute top-0 left-0 group-even:left-100 bg-purple-600 blur-[100px] transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 w-md h-14 z-0" />
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-12 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bg-purple-600 blur-[130px] bottom-0 right-0 w-52 h-52 z-0" />
        <div className="absolute bg-purple-600 blur-[130px] top-0 left-0 w-52 h-52 z-0" />
      </section>

  )
}

export default HTW