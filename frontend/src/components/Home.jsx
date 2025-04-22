import React from 'react'
import HeroSection from './HeroSection'
import { CategoryCarousel } from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import Navbar from './shared/Navbar'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Home = () => {
    useGetAllJobs();
    
    return (
        <div>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
            <Footer />
        </div>
    )
}

export default Home