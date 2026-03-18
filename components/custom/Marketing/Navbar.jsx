"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { useTranslation } from "react-i18next";

import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import ProfileCard from '../ProfileCard';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { useAuth } from '@/providers/useAuth'

import { landingPageMenus } from '@/lib/utils/constant'
import { getUserInitials } from '@/lib/utils/nameInitial'
import { cn } from '@/lib/utils/utils'



const Navbar = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth()
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [navbg, setNavBg] = useState(false);

    useEffect(()=>{
        window.addEventListener('scroll', ()=>{
            if(window.scrollY > 30){
                setNavBg(true)
            }else{
                setNavBg(false)
            }
        })
    },[navbg])


    return (
        <>
            <header className={cn(" h-16 sticky inset-0  backdrop-blur-md z-50", navbg ? "bg-transparent backdrop-blur-2xl shadow-md" : "shadow-none bg-card")}>
                <div className="flex w-full justify-between items-center h-full p-3  max-w-7xl mx-auto">

                    <div className="flex-1">
                        <Logo/>
                    </div>
                    <nav className='hidden md:block'>
                        <ul className='flex  gap-4 justify-center items-center text-slate-600 dark:text-slate-300 '>
                            {
                                landingPageMenus.map((menu, index) => (
                                    <Link href={menu.href} key={index}>

                                        <li className="text-sm tracking-wider transition-all hover:font-bold 
                                        hover:text-slate-700
                                        dark:hover:text-slate-100">
                                           {t(menu.translationKey)}
                                        </li>
                                    </Link>
                                ))
                            }
                        </ul>
                    </nav>
                    <div className="flex flex-1 gap-2 justify-end items-center">
                        <ThemeToggle />
                        <LanguageSelector />
                        {user ? (
                            // Show user avatar and name when logged in
                            <div className="flex items-center gap-2 ">
                                <Link href="/dashboard" >
                                    <Button>
                                        {t('navbar.console')}
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="bg-popover rounded-md p-[3.5px] transition-colors cursor-pointer"
                                >
                                    <Avatar className="w-8 h-8 border-[.5px] border-purple-500">
                                        <AvatarImage 
                                            src={profile?.avatarUrl || "/profile.png"} 
                                            alt={profile?.name || "Profile"} 
                                            className={"object-cover"}
                                        />
                                        <AvatarFallback className="text-xs font-semibold">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </div>
                        ) : (
                            // Show login button when not logged in
                            <Link href={'/auth?continueTo=/dashboard'}>
                                <Button className='cursor-pointer'>{t('navbar.login')}</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            
            {/* Profile Modal */}
            <ProfileCard modal={showProfileModal} setModal={setShowProfileModal} />
        </>
    )
}

export default Navbar