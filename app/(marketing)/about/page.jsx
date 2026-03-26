import AboutSection from '@/components/Marketing/AboutSection'
import React from 'react'

const AboutUs = () => {
    return (
        < section
            className="px-4 md:px-10 py-4 w-full relative overflow-hidden"
        >
            <div className="bg-slate-600 w-3xl h-14 rounded-full rotate-45 absolute top-1/2 -left-24 md:left-12 z-0" />
            <div className="bg-slate-600 w-3xl h-14 rounded-full rotate-45 absolute top-1/2 translate-y-36 -left-24 md:left-12 z-0" />
            <div className="relative z-20">
                <AboutSection />
            </div>
        </section >
    )
}

export default AboutUs
